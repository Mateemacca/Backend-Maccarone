logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    Swal.fire({
        title: '¿Seguro que quieres cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const result = await fetch('http://localhost:8080/api/session/logout', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { redirect } = await result.json();
            window.location.href = redirect;
        }
    });
});