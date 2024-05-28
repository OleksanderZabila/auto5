const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Registration and Login Form Tests', function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function () {
    await driver.quit();
  });

  it('should fill registration form and submit successfully', async function () {
    await driver.get('http://localhost:3000'); // Update with your URL

    // Заполнение полей формы регистрации
    await driver.findElement(By.name('login')).sendKeys('test_user');
    await driver.findElement(By.name('password')).sendKeys('test_password');
    await driver.findElement(By.name('confirmPassword')).sendKeys('test_password');
    await driver.findElement(By.name('phone')).sendKeys('1234567890');
    await driver.findElement(By.name('email')).sendKeys('test@example.com');
    await driver.findElement(By.name('captcha')).sendKeys('correct_captcha'); // Assuming you set the correct captcha text

    // Отправка формы регистрации
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Проверка успешной регистрации
    await driver.wait(until.elementLocated(By.id('success_message')), 5000);
    const successMessage = await driver.findElement(By.id('success_message')).getText();
    assert.strictEqual(successMessage, 'Registration successful');
  });

  it('should display error message when trying to login without CAPTCHA', async function () {
    await driver.get('http://localhost:3000'); // Update with your URL

    // Заполнение полей формы входа
    await driver.findElement(By.name('login')).sendKeys('test_user');
    await driver.findElement(By.name('password')).sendKeys('test_password');

    // Попытка входа без CAPTCHA
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Проверка сообщения об ошибке
    await driver.wait(until.elementLocated(By.id('error_message')), 5000);
    const errorMessage = await driver.findElement(By.id('error_message')).getText();
    assert.strictEqual(errorMessage, 'Please enter CAPTCHA');
  });
});
