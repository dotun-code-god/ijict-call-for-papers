export async function getRecaptchaToken() {
    return new Promise<string | null>(resolve => {
        grecaptcha.ready(async() => {
            const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

            if(!siteKey){
                resolve(null);
                return;
            }

            const token = await grecaptcha.execute(siteKey, {
                action: "submit"
            })

            resolve(token);
        })
    })
}