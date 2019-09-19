var email = document.getElementById("email");
var password = document.getElementById("password");
var loginBox = document.getElementsByClassName("login")[0];
if (localStorage.getItem("admin-token")) {
	showList();
}
function login() {
	axios
		.post("/auth/login", { email: email.value, password: password.value })
		.then(data => {
			localStorage.setItem("admin-token", data.data.data);
			showList();
		})
		.catch(err => {
			console.dir(err);
			alert(err.response.data.message);
		});
}

function showList() {
	loginBox.style.transform = "translateX(-100vw)";
	setTimeout(() => {
		loginBox.parentElement.removeChild(loginBox);
	}, 1000);
}
