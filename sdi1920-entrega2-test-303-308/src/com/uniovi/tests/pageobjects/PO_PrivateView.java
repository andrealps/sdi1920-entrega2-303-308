package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_PrivateView extends PO_NavView {

	/**
	 * Inicia la sesión de un usuario (datos correctos)
	 * 
	 * @param driver
	 * @param email
	 * @param pass
	 */
	static public void login(WebDriver driver, String email, String pass) {
		// Vamos al formulario de inicio de sesión
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_LoginView.fillForm(driver, email, pass);
		// Comprobamos que nos redirige al listado de usuarios
		PO_View.checkElement(driver, "id", "listaUsuarios");
	}
	
	/**
	 * Inicia la sesión de un usuario en la parte de servicios web
	 * 
	 * @param driver
	 * @param email
	 * @param pass
	 */
	static public void loginAPI(WebDriver driver, String email, String pass) {
		// Rellenamos el formulario.
		PO_LoginView.fillForm(driver, email, pass);
		// Comprobamos que nos redirige al listado de amigos
		PO_View.checkElement(driver, "id", "people-list");
	}

	/**
	 * Realiza una búsqueda en la lista de usuarios de la aplicación
	 * 
	 * @param driver
	 */
	static public void search(WebDriver driver, String text) {
		WebElement texto = driver.findElement(By.name("busqueda"));
		texto.click();
		texto.clear();
		texto.sendKeys(text);

		By boton = By.id("btnSearch");
		driver.findElement(boton).click();
	}	

}