const canvas = document.getElementById('captchaCanvas');
const ctx = canvas.getContext('2d');
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateCaptcha() {
    const captcha = [];
    for (let i = 0; i < 6; i++) {
        captcha.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return captcha.join('');
}

function drawCaptcha() {
    const captchaText = generateCaptcha();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillText(captchaText, 10, 40);
}

drawCaptcha();

canvas.addEventListener('click', drawCaptcha);
