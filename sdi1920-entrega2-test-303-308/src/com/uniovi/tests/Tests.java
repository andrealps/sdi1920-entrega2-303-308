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
	static String Geckdriver024 = "C:\\Users\\SARA\\Desktop\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";
	// static String Geckdriver024 = "D:\\UNIVERSIDAD\\Tercer
	// curso\\SDI\\material\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";

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
		// Fijamos el timeout en cada opción de carga de una vista. 2 segundos.
		PO_View.setTimeout(2);
		driver.navigate().to(URLreiniciarBD);
	}

	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		// driver.quit();
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
		assertTrue(elementos.size() == 2);
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
		assertTrue(elementos.size() == 2);
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

	// PR017. Sin hacer /
	@Test
	public void PR17() {
		assertTrue("PR17 sin hacer", false);
	}

	// PR18. Sin hacer /
	@Test
	public void PR18() {
		assertTrue("PR18 sin hacer", false);
	}

	// PR19. Sin hacer /
	@Test
	public void PR19() {
		assertTrue("PR19 sin hacer", false);
	}

	// P20. Sin hacer /
	@Test
	public void PR20() {
		assertTrue("PR20 sin hacer", false);
	}

	// PR21. Sin hacer /
	@Test
	public void PR21() {
		assertTrue("PR21 sin hacer", false);
	}

	// PR22. Sin hacer /
	@Test
	public void PR22() {
		assertTrue("PR22 sin hacer", false);
	}

	// PR23. Sin hacer /
	@Test
	public void PR23() {
		assertTrue("PR23 sin hacer", false);
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

	// PR27. Sin hacer /
	@Test
	public void PR27() {
		assertTrue("PR27 sin hacer", false);
	}

	// PR029. Sin hacer /
	@Test
	public void PR29() {
		assertTrue("PR29 sin hacer", false);
	}

	// PR030. Sin hacer /
	@Test
	public void PR30() {
		assertTrue("PR30 sin hacer", false);
	}

	// PR031. Sin hacer /
	@Test
	public void PR31() {
		assertTrue("PR31 sin hacer", false);
	}

}
