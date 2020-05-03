package com.uniovi.tests.pageobjects;

import org.openqa.selenium.WebDriver;

public class PO_PrivateView extends PO_NavView {

	/**
	 * Inicia la sesión de un usuario (datos correctos)
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

}