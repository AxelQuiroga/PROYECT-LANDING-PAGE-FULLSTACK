const CAPTCHA_PROVIDER = (process.env.CAPTCHA_PROVIDER || "none").toLowerCase();
const CAPTCHA_SITE_KEY = process.env.CAPTCHA_SITE_KEY || "";
const CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY || "";
const HONEYPOT_FIELD = process.env.HONEYPOT_FIELD || "website";
const DEFAULT_MIN_SUBMIT_MS = 4000;
const parsedMinSubmitMs = Number(process.env.FORM_MIN_SUBMIT_MS);
const FORM_MIN_SUBMIT_MS = Number.isFinite(parsedMinSubmitMs)
  ? parsedMinSubmitMs
  : DEFAULT_MIN_SUBMIT_MS;

const supportedProviders = new Set(["turnstile", "recaptcha"]);

function getCaptchaConfig() {
  const enabled = supportedProviders.has(CAPTCHA_PROVIDER)
    && Boolean(CAPTCHA_SITE_KEY)
    && Boolean(CAPTCHA_SECRET_KEY);

  return {
    enabled,
    provider: enabled ? CAPTCHA_PROVIDER : "none",
    siteKey: enabled ? CAPTCHA_SITE_KEY : "",
    minSubmitMs: FORM_MIN_SUBMIT_MS,
  };
}

async function verifyCaptchaToken({ provider, token, remoteIp }) {
  const verifyUrl = provider === "turnstile"
    ? "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    : "https://www.google.com/recaptcha/api/siteverify";

  const payload = new URLSearchParams({
    secret: CAPTCHA_SECRET_KEY,
    response: token,
  });

  if (remoteIp) {
    payload.append("remoteip", remoteIp);
  }

  const verificationResponse = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!verificationResponse.ok) return false;

  const verificationData = await verificationResponse.json();
  return Boolean(verificationData?.success);
}

async function antiBotLead(req, res, next) {
  try {
    const captchaConfig = getCaptchaConfig();
    const honeypotValue = req.body?.[HONEYPOT_FIELD];

    if (typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
      return res.status(400).json({
        success: false,
        message: "No se pudo procesar el envio.",
      });
    }

    const rawStartedAt = req.body?.formStartedAt;
    const formStartedAt = Number(rawStartedAt);
    const elapsedMs = Date.now() - formStartedAt;

    if (!Number.isFinite(formStartedAt) || formStartedAt <= 0) {
      return res.status(400).json({
        success: false,
        message: "No se pudo validar el formulario.",
      });
    }

    if (elapsedMs < FORM_MIN_SUBMIT_MS) {
      return res.status(429).json({
        success: false,
        message: `Espera al menos ${Math.ceil(FORM_MIN_SUBMIT_MS / 1000)} segundos antes de enviar.`,
      });
    }

    if (!captchaConfig.enabled) return next();

    const captchaToken = typeof req.body?.captchaToken === "string"
      ? req.body.captchaToken.trim()
      : "";

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Completa el CAPTCHA para continuar.",
      });
    }

    const isCaptchaValid = await verifyCaptchaToken({
      provider: captchaConfig.provider,
      token: captchaToken,
      remoteIp: req.ip,
    });

    if (!isCaptchaValid) {
      return res.status(400).json({
        success: false,
        message: "No se pudo validar el CAPTCHA.",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error validando seguridad del formulario.",
    });
  }
}

export { getCaptchaConfig };
export default antiBotLead;
