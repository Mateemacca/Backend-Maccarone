const changeRoleBtn = document.getElementById("changerolbtn");

async function changeUserRole() {
  const userId = changeRoleBtn.dataset.userid;
  console.log(userId);
  const url = `http://localhost:8080/api/session/premium/${userId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Error:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

changeRoleBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  changeUserRole();
});
