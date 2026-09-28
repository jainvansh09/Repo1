// ================= LOGIN =================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const userId =
                document.getElementById(
                    "userId"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;


            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                userId,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                if (data.success) {

                    localStorage.setItem(
                        "student",
                        JSON.stringify(
                            data.student
                        )
                    );

                    window.location.href =
                        "/welcome";

                } else {

                    message.textContent =
                        data.message;

                }

            } catch (error) {

                console.error(error);

                document.getElementById(
                    "loginMessage"
                ).textContent =
                    "Unable to connect to server.";

            }

        }
    );
}



// ================= REGISTRATION =================

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const student = {

                name:
                    document.getElementById(
                        "name"
                    ).value,

                rollNo:
                    document.getElementById(
                        "rollNo"
                    ).value,

                branch:
                    document.getElementById(
                        "branch"
                    ).value,

                semester:
                    document.getElementById(
                        "semester"
                    ).value,

                email:
                    document.getElementById(
                        "email"
                    ).value,

                phone:
                    document.getElementById(
                        "phone"
                    ).value,

                userId:
                    document.getElementById(
                        "userId"
                    ).value,

                password:
                    document.getElementById(
                        "password"
                    ).value
            };


            try {

                const response =
                    await fetch(
                        "/api/students",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    student
                                )
                        }
                    );


                const data =
                    await response.json();


                const message =
                    document.getElementById(
                        "message"
                    );


                if (data.success) {

                    message.textContent =
                        "Account created successfully! Redirecting to login...";

                    registrationForm.reset();


                    setTimeout(() => {

                        window.location.href =
                            "/";

                    }, 1500);


                } else {

                    message.textContent =
                        data.message;

                }

            } catch (error) {

                console.error(error);

                document.getElementById(
                    "message"
                ).textContent =
                    "Unable to connect to server.";

            }

        }
    );
}