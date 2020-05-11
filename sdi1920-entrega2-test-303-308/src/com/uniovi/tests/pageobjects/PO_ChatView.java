package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ChatView extends PO_NavView {

	static public void createMessage(WebDriver driver, String text) {
		WebElement input = driver.findElement(By.id("inputMensaje"));
		input.click();
		input.clear();
		input.sendKeys(text);
		
		//Pulsar el boton de Enviar
		By boton = By.id("sendMessage");
		driver.findElement(boton).click();			
	}
}
