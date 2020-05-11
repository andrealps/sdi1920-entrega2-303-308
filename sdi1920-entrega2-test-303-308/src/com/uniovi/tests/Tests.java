package com.uniovi.tests;

//Paquetes Java
import java.util.List;
//Paquetes JUnit 
import org.junit.*;
import org.junit.runners.MethodSorters;

import static org.junit.Assert.assertTrue;

//Paquetes Selenium 
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.*;

//Paquetes Utilidades de Testing Propias
import com.uniovi.tests.util.SeleniumUtils;

//Paquetes con los Page Object
import com.uniovi.tests.pageobjects.*;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Tests {
	// En Windows (Debe ser la versión 65.0.1 y desactivar las actualizaciones
	// automáticas)):
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	// static String Geckdriver024 =
	// "C:\\Users\\SARA\\Desktop\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";
	static String Geckdriver024 = "D:\\UNIVERSIDAD\\Tercer curso\\SDI\\material\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";

	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	static String URL = "https://localhost:8081";
	static String URLreiniciarBD = "https://localhost:8081/reiniciarBD";

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
		// Configuramos las pruebas.
		// Fijamos el timeout en cada opción de carga de una vista
		PO_View.setTimeout(30);
		driver.navigate().to(URLreiniciarBD);
	}

	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		// driver.quit();
	}

	public void goToAPI() {
		driver.navigate().to(URL + "/cliente.html");
	}
	
	/**
	 * [Prueba1] Registro de Usuario con datos válidos
	 */
	@Test
	public void PR01() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "maria@gmail.com", "María", "Pérez Álvarez", "77777", "77777");
		// Comprobamos que nos redirige al formulario de login
		PO_View.checkElement(driver, "id", "loginUsuarios");

	}

	/**
	 * [Prueba2] Registro de Usuario con datos inválidos (email vacío, nombre vacío,
	 * apellidos vacíos) Prueba caso NEGATIVO
	 */
	@Test
	public void PR02() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "", "", "", "77777", "77777");
		// Comprobamos que seguimos en el registro
		PO_View.checkElement(driver, "id", "registroUsuarios");
	}

	/**
	 * [Prueba3] Registro de Usuario con datos inválidos (Repeticion de contraseña
	 * inválida) Prueba caso POSITIVO
	 */
	@Test
	public void PR03() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "a@h.com", "Ejemplo", "Ejemplo2", "77777", "77771");
		// Comprobamos que seguimos en el registro
		PO_View.checkElement(driver, "id", "registroUsuarios");
		// Comprobamos el error de contraseña inválida
		SeleniumUtils.textoPresentePagina(driver, "Las contraseñas no coinciden");
	}

	/**
	 * [Prueba4] Registro de Usuario con datos inválidos (Email existente) Prueba
	 * caso POSITIVO
	 */
	@Test
	public void PR04() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "ejemplo1@gmail.com", "Ejemplo", "Ejemplo2", "77777", "77777");
		// Comprobamos que seguimos en el registro
		PO_View.checkElement(driver, "id", "registroUsuarios");
		// Comprobamos el error de email repetido
		SeleniumUtils.textoPresentePagina(driver, "El email ya está en uso");
	}

	/**
	 * [Prueba5] Inicio de sesión con datos válidos (usuario estándar)
	 */
	@Test
	public void PR05() {
		// Vamos al formulario de inicio de sesión
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_LoginView.fillForm(driver, "ejemplo1@gmail.com", "1234");
		// Comprobamos que nos redirige al listado de usuarios
		PO_View.checkElement(driver, "id", "listaUsuarios");
	}

	/**
	 * [Prueba6] Inicio de sesión con datos inválidos (usuario estándar, campo email
	 * y contraseña vacíos).
	 */
	@Test
	public void PR06() {
		// Vamos al formulario de inicio de sesión
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Dejamos el formulario vacío
		PO_LoginView.fillForm(driver, "", "");
		// Comprobamos que no iniciamos sesión
		PO_View.checkElement(driver, "id", "loginUsuarios");
	}

	/**
	 * [Prueba7] Inicio de sesión con datos válidos (usuario estándar, email
	 * existente, pero contraseña incorrecta).
	 */
	@Test
	public void PR07() {
		// Vamos al formulario de inicio de sesión
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_LoginView.fillForm(driver, "ejemplo1@gmail.com", "aaaaa");
		// Comprobamos que no iniciamos sesión (se muestra mensaje de error)
		PO_View.checkElement(driver, "id", "loginUsuarios");
		SeleniumUtils.textoPresentePagina(driver, "Email o password incorrecto");
	}

	/**
	 * [Prueba8] Inicio de sesión con datos inválidos (usuario estándar, email no
	 * existente y contraseña no vacía).
	 */
	@Test
	public void PR08() {
		// Vamos al formulario de inicio de sesión
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_LoginView.fillForm(driver, "noexistente@gmail.com", "1234");
		// Comprobamos que no iniciamos sesión (se muestra mensaje de error)
		PO_View.checkElement(driver, "id", "loginUsuarios");
		SeleniumUtils.textoPresentePagina(driver, "Email o password incorrecto");
	}

	/**
	 * [Prueba9] Hacer click en la opción de salir de sesión y comprobar que se
	 * redirige a la página de inicio de sesión (Login).
	 */
	@Test
	public void PR09() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Salimos de sesión
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
		// Comprobamos que estamos en la página de login
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
	}

	/**
	 * [Prueba10] Comprobar que el botón cerrar sesión no está visible si el usuario
	 * no está autenticado.
	 */
	@Test
	public void PR10() {
		// Comprobamos que el botón de cerrar sesión no está disponible al no tener la
		// sesión iniciada
		SeleniumUtils.textoNoPresentePagina(driver, "Desconectar");
	}

	/**
	 * [Prueba11] Mostrar el listado de usuarios y comprobar que se muestran todos
	 * los que existen en el sistema
	 */
	@Test
	public void PR11() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Nos redirige a la lista de usuarios. Se cargan todos los usuarios
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		assertTrue(elementos.size() == 5);
		// Nos vamos a la siguiente página
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@class, 'page-link')]");
		elementos.get(1).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 3);
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/**
	 * [Prueba12] Hacer una búsqueda con el campo vacío y comprobar que se muestra
	 * la página que corresponde con el listado usuarios existentes en el sistema.
	 */
	@Test
	public void PR12() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Nos redirige a la lista de usuarios. Hacemos una búsqueda con campo vacío
		PO_PrivateView.search(driver, "");
		// Se cargan todos los usuarios
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		assertTrue(elementos.size() == 5);
		// Nos vamos a la siguiente página
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@class, 'page-link')]");
		elementos.get(1).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 3);
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/**
	 * [Prueba13] Hacer una búsqueda escribiendo en el campo un texto que no exista
	 * y comprobar que se muestra la página que corresponde, con la lista de
	 * usuarios vacía.
	 */

	@Test
	public void PR13() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Nos redirige a la lista de usuarios. Hacemos una búsqueda con campo vacío
		PO_PrivateView.search(driver, "prueba");
		// Y esperamos a que NO aparezca nada
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "@gmail.com", PO_View.getTimeout());
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/**
	 * [Prueba14] Hacer una búsqueda con un texto específico y comprobar que se
	 * muestra la página que corresponde, con la lista de usuarios en los que el
	 * texto especificados sea parte de su nombre, apellidos o de su email.
	 */
	@Test
	public void PR14() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Nos redirige a la lista de usuarios

		// BUSQUEDA POR NOMBRE
		PO_PrivateView.search(driver, "Sam");
		// Comprobamos que aparece el usuario que corresponde
		PO_View.checkElement(driver, "text", "ejemplo2@gmail.com");

		// BUSQUEDA POR APELLIDOS
		PO_PrivateView.search(driver, "Shan");
		// Comprobamos que aparece el usuario que corresponde
		PO_View.checkElement(driver, "text", "ejemplo4@gmail.com");

		// BUSQUEDA POR EMAIL
		PO_PrivateView.search(driver, "ejemplo4");
		// Comprobamos que aparece el usuario que corresponde
		PO_View.checkElement(driver, "text", "Nadia");

		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/*
	 * [Prueba15] Desde el listado de usuarios de la aplicación, enviar una
	 * invitación de amistad a un usuario. Comprobar que la solicitud de amistad
	 * aparece en el listado de invitaciones
	 */
	@Test
	public void PR15() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Vamos a lista de usuarios
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		// Enviamos peticion
		elementos = PO_View.checkElement(driver, "free",
				"//td[contains(text(), 'Samuel')]/following-sibling::*/a[contains(@href, '/friendRequest/send/ejemplo2@gmail.com')]");
		elementos.get(0).click();
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
		// Nos logueamos con el ususario al que le enviamos la peticion
		PO_PrivateView.login(driver, "ejemplo2@gmail.com", "1234");
		// Vamos a la pestaña amigos
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'mFriends')]/a");
		elementos.get(0).click();
		// Esperamos a que aparezca la pestaña de solicitud de amistad
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friendRequests')]");
		elementos.get(0).click();
		// Comprobamos que hay una solicitud de el usuario ejemplo1: Marina
		SeleniumUtils.textoPresentePagina(driver, "Marina");
		// Nos deconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

	}

	/*
	 * [Prueba16] Desde el listado de usuarios de la aplicación, enviar una
	 * invitación de amistad a un usuario al que ya le habíamos enviado la
	 * invitación previamente. No debería dejarnos enviar la invitación
	 */
	@Test
	public void PR16() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo1@gmail.com", "1234");
		// Vamos a lista de usuarios
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		// Enviamos peticion
		elementos = PO_View.checkElement(driver, "free",
				"//td[contains(text(), 'Samuel')]/following-sibling::*/a[contains(@href, '/friendRequest/send/ejemplo2@gmail.com')]");
		elementos.get(0).click();
		// Nos deberia aparecer un mensaje de que ya le ha enviado una peticiñon
		SeleniumUtils.textoPresentePagina(driver, "Ya has mandado petición a este usuario");
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/*
	 * [Prueba17] Mostrar el listado de invitaciones de amistad recibidas. Comprobar
	 * con un listado que contenga varias invitaciones recibidas.
	 */
	@Test
	public void PR17() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo3@gmail.com", "1234");
		// Vamos a lista de usuarios
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		// Enviamos peticion
		elementos = PO_View.checkElement(driver, "free",
				"//td[contains(text(), 'Samuel')]/following-sibling::*/a[contains(@href, '/friendRequest/send/ejemplo2@gmail.com')]");
		elementos.get(0).click();
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo4@gmail.com", "1234");
		// Vamos a lista de usuarios
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		// Enviamos peticion
		elementos = PO_View.checkElement(driver, "free",
				"//td[contains(text(), 'Samuel')]/following-sibling::*/a[contains(@href, '/friendRequest/send/ejemplo2@gmail.com')]");
		elementos.get(0).click();
		// Nos desconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");

		// Nos logueamos con el ususario al que le enviamos la peticion
		PO_PrivateView.login(driver, "ejemplo2@gmail.com", "1234");
		// Vamos a la pestaña amigos
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'mFriends')]/a");
		elementos.get(0).click();
		// Esperamos a que aparezca la pestaña de solicitud de amistad
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friendRequests')]");
		elementos.get(0).click();
		// Comprobamos que hay 3 solicitudes de amistad
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 3);
		// Nos deconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/*
	 * [Prueba18] Sobre el listado de invitaciones recibidas. Hacer click en el
	 * botón/enlace de una de ellas y comprobar que dicha solicitud desaparece del
	 * listado de invitaciones.
	 */
	@Test
	public void PR18() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo2@gmail.com", "1234");
		// Vamos a la pestaña amigos
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'mFriends')]/a");
		elementos.get(0).click();
		// Esperamos a que aparezca la pestaña de solicitud de amistad
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'friendRequests')]");
		elementos.get(0).click();
		// Se cargan todos los usuarios
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		// Aceptamos la petición de Nadia
		elementos = PO_View.checkElement(driver, "free",
				"//td[contains(text(), 'Nadia')]/following-sibling::*/a[contains(@href, '/friendRequest/accept/ejemplo4@gmail.com')]");
		elementos.get(0).click();
		// Comprobamos que desparece
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "Nadia", PO_View.getTimeout());
		// Nos deconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/*
	 * [Prueba19] Mostrar el listado de amigos de un usuario. Comprobar que el
	 * listado contiene los amigos que deben ser.
	 */
	@Test
	public void PR19() {
		// Nos logueamos
		PO_PrivateView.login(driver, "ejemplo2@gmail.com", "1234");
		// Vamos a la pestaña amigos
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'mFriends')]/a");
		elementos.get(0).click();
		// Esperamos a que aparezca la pestaña de amigos
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'myFriends')]");
		elementos.get(0).click();
		// Se cargan todos los usuarios
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		// Comprobamos que solo tiene a Nadia como amiga
		SeleniumUtils.textoPresentePagina(driver, "Nadia");
		assertTrue(elementos.size() == 1);
		// Nos deconectamos
		PO_HomeView.clickOption(driver, "desconectarse", "class", "btn btn-primary");
	}

	/*
	 * [Prueba20] Intentar acceder sin estar autenticado a la opción de listado de
	 * usuarios. Se deberá volver al formulario de login.
	 */
	@Test
	public void PR20() {
		// Intentamos acceder al listado de usuarios
		driver.navigate().to("https://localhost:8081/listaUsuarios");
		// Comprobamos que nos redirige a la página de inicio de sesión
		PO_View.checkElement(driver, "id", "loginUsuarios");
	}

	/*
	 * [Prueba21] Intentar acceder sin estar autenticado a la opción de listado de
	 * invitaciones de amistad recibida de un usuario estándar. Se deberá volver al
	 * formulario de login.
	 */
	@Test
	public void PR21() {
		// Intentamos acceder al listado de usuarios
		driver.navigate().to("https://localhost:8081/listFriendRequests");
		// Comprobamos que nos redirige a la página de inicio de sesión
		PO_View.checkElement(driver, "id", "loginUsuarios");
	}

	/*
	 * [Prueba23] Inicio de sesión con datos válidos.
	 */
	@Test
	public void PR23() {
		// Intentamos acceder al listado de usuarios
		driver.navigate().to("https://localhost:8081/cliente.html");
		// Comprobamos que nos redirige a la página de inicio de sesión
		PO_View.checkElement(driver, "id", "email");
		// Rellenamos el formulario
		PO_LoginView.fillForm(driver, "ejemplo1@gmail.com", "1234");
		// Comprobamos que nos redirige al chat
		PO_View.checkElement(driver, "id", "people-list");
	}

	// PR24. Sin hacer /
	@Test
	public void PR24() {
		assertTrue("PR24 sin hacer", false);
	}

	// PR25. Sin hacer /
	@Test
	public void PR25() {
		assertTrue("PR25 sin hacer", false);
	}

	// PR26. Sin hacer /
	@Test
	public void PR26() {
		assertTrue("PR26 sin hacer", false);
	}

	/*
	 * [Prueba27] Acceder a la lista de mensajes de un amigo “chat”, la lista debe
	 * contener al menos tres mensajes.
	 */
	@Test
	public void PR27() {
		// Vamos a la URL de la API
		goToAPI();
		// Nos logueamos y comprobamos que vemos la lista de amigos
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Entramos en el chat con el usuario ejemplo6@gmail.com
		List<WebElement> elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Comprobamos que hay 3 mensajes
		elementos = PO_View.checkElement(driver, "free", "//span[contains(@class, 'message-data-time')]");
		assertTrue(elementos.size() == 3);
	}

	/*
	 * [Prueba28] Acceder a la lista de mensajes de un amigo “chat” y crear un nuevo
	 * mensaje, validar que el mensaje aparece en la lista de mensajes.
	 */
	@Test
	public void PR28() {
		// Vamos a la URL de la API
		goToAPI();
		// Nos logueamos y comprobamos que vemos la lista de amigos
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Entramos en el chat con el usuario ejemplo6@gmail.com
		List<WebElement> elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Enviamos un mensaje a este usuario
		PO_ChatView.createMessage(driver, "Prueba28");
		elementos = PO_View.checkElement(driver, "free", "//span[contains(@class, 'message-data-time')]");
		assertTrue(elementos.size() == 4);
	}

	/*
	 * [Prueba29] Identificarse en la aplicación y enviar un mensaje a un amigo,
	 * validar que el mensaje enviado aparece en el chat. Identificarse después con
	 * el usuario que recibido el mensaje y validar que tiene un mensaje sin leer,
	 * entrar en el chat y comprobar que el mensaje pasa a tener el estado leído.
	 * 
	 */
	@Test
	public void PR29() {
		// Vamos a la URL de la API
		goToAPI();
		// Nos logueamos y comprobamos que vemos la lista de amigos
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Entramos en el chat con el usuario ejemplo7@gmail.com
		List<WebElement> elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_1')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Enviamos un mensaje a este usuario
		PO_ChatView.createMessage(driver, "Prueba29");
		// Nos logueamos con el otro usuario
		goToAPI();
		PO_PrivateView.loginAPI(driver, "ejemplo7@gmail.com", "1234");
		// Entramos en el chat con el usuario ejemplo5@gmail.com
		elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Comprobamos que hay un mensaje del usuario ejemplo5@gmail.com
		elementos = PO_View.checkElement(driver, "free", "//div[contains(text(), 'Prueba29')]");
		assertTrue(elementos.size() == 1);

	}

	/*
	 * [Prueba30] Identificarse en la aplicación y enviar tres mensajes a un amigo,
	 * validar que los mensajes enviados aparecen en el chat. Identificarse después
	 * con el usuario que recibido el mensaje y validar que el número de mensajes
	 * sin leer aparece en la propia lista de amigos.
	 * 
	 */
	@Test
	public void PR30() {
		// Vamos a la URL de la API
		goToAPI();
		// Nos logueamos y comprobamos que vemos la lista de amigos
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Entramos en el chat con el usuario ejemplo8@gmail.com
		List<WebElement> elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_2')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Enviamos tres mensajes a este usuario
		PO_ChatView.createMessage(driver, "Prueba30_1");
		PO_ChatView.createMessage(driver, "Prueba30_2");
		PO_ChatView.createMessage(driver, "Prueba30_3");
		// Nos logueamos con el otro usuario
		goToAPI();
		PO_PrivateView.loginAPI(driver, "ejemplo8@gmail.com", "1234");
		// Comprobamos que hay 3 mensajes sin leer desde las notificaciones
		elementos = PO_View.checkElement(driver, "free", "//div[contains(text(), '3')]");
		assertTrue(elementos.size() == 1);
	}

	/*
	 * [Prueba31] Identificarse con un usuario A que al menos tenga 3 amigos, ir al
	 * chat del ultimo amigo de la lista y enviarle un mensaje, volver a la lista de
	 * amigos y comprobar que el usuario al que se le ha enviado el mensaje esta en
	 * primera posición. Identificarse con el usuario B y enviarle un mensaje al
	 * usuario A. Volver a identificarse con el usuario A y ver que el usuario que
	 * acaba de mandarle el mensaje es el primero en su lista de amigos.
	 */
	@Test
	public void PR31() {
		// Vamos a la URL de la API
		goToAPI();
		// Nos logueamos y comprobamos que vemos la lista de amigos
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Comprobamos el nombre del último usuario (Ander)
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
				"//div[contains(@id, 'dataFriend_2')]//a[contains(@class, 'infoFriend')]//span[contains(text(), 'Ander')]",
				50);
		assertTrue(elementos.size() == 1);
		// Entramos en el último chat
		elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_2')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Enviamos un mensaje a este usuario
		PO_ChatView.createMessage(driver, "Prueba31_1");
		// Volvemos a la lista de amigos
		elementos = PO_View.checkElement(driver, "free", "//a[contains(text(), 'Aplicación')]");
		elementos.get(0).click();
		// Vemos que ahora Ander está arriba
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]//span[contains(text(), 'Ander')]",
				50);
		// Nos identificamos con el usuario ejemplo7@gmail.com
		goToAPI();
		PO_PrivateView.loginAPI(driver, "ejemplo7@gmail.com", "1234");
		// Le mandamos un mensaje al usuario ejemplo5@gmail.com
		elementos = PO_View.checkElement(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]");
		elementos.get(0).click();
		// Enviamos tres mensajes a este usuario
		PO_ChatView.createMessage(driver, "Prueba31_2");
		// Volvemos a loguearnos con el usuario ejemplo5@gmail.com
		goToAPI();
		PO_PrivateView.loginAPI(driver, "ejemplo5@gmail.com", "1234");
		// Comprobamos que el nombre del último usuario ha cambiado (ahora es Carla)
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free",
				"//div[contains(@id, 'dataFriend_0')]//a[contains(@class, 'infoFriend')]//span[contains(text(), 'Carla')]",
				50);
	}

}
