//Login User
export const login = async (email,password) => {

    const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
            method: "POST",

            headers: {
                "content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();
    return data;
};