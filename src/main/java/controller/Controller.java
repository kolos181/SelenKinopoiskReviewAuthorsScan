package controller;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.Response;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kolos on 09.01.2016.
 */
public class Controller {
    public static void main(String[] args) throws Exception {
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Kolos\\Desktop\\chromedriver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        String htmlFileName = "Inter4.html";
        driver.get("C:\\Users\\Kolos\\Desktop\\InterstellarKinopoisk\\" + htmlFileName);
        Thread.sleep(10000);
        List<WebElement> responses = driver.findElements(By.className("profile_name"));
        try {
            for (WebElement temp : responses) {
                System.out.println(temp.getText());
            }
        } catch (NoSuchElementException e) {

        }
    }
}
