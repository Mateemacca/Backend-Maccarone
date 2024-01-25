const socket = io();

let userName;

Swal.fire({
    title: 'Ingresa su nombre',
    input: 'text',
    inputValidator: (value) => {
        if (!value) return 'Por favor ingresa un nombre';
    },
}).then((data) => {
    userName = data.value;
    socket.emit('newUser', userName);
});

const inputData = document.getElementById('inputData');
const outputData = document.getElementById('outputData');

inputData.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (inputData.value.trim().length > 0) {
            socket.emit('message', { user: userName, data: inputData.value });
            inputData.value = '';
        }
    }
});

socket.on('storedMessages', (storedMessages) => {
    let messages = '';
    storedMessages.forEach((message) => {
        messages += ` <div class="flex items-start mb-2">
        <div class="bg-zinc-800  text-white p-2 rounded-md max-w-xs">
            <p class="mb-1 font-bold">${message.user}</p>
            <p class="text-sm text-gray-200">${message.data}</p>
        </div>
    </div>`;
    });

    outputData.innerHTML = messages;
});
socket.on('messageLogs', (data) => {
    data.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = ` <div class="flex items-start mb-2">
      <div class="bg-zinc-800  text-white p-2 rounded-md max-w-xs">
          <p class="mb-1 font-bold">${message.user}</p>
          <p class="text-sm text-gray-200">${message.data}</p>
      </div>
  </div>`;
      outputData.appendChild(messageElement);
    });
  

  });




socket.on('notification', (user) => {
    Swal.fire({
        text: `${user} se conecto`,
        toast: true,
        position: 'top-right',
    });
});

const dropArea = document.getElementById('outputData');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;

    if (files.length > 0) {
        handleFiles(files, { user: userName });
    }
});

// ...


    // ... (Tu código anterior)

    function handleFiles(files, message) {
        const file = files[0];

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('flex', 'flex-col', 'items-start', 'mb-2', 'bg-zinc-800', 'text-white', 'p-2', 'rounded-md', 'max-w-xs');

                // Agrega el nombre del usuario como un párrafo dentro del contenedor
                const userNameElement = document.createElement('p');
                userNameElement.classList.add('font-bold', 'text-white');
                userNameElement.textContent = message.user;

                // Contenedor de la imagen
                const imageContainer = document.createElement('div');

                const image = new Image();
                image.src = e.target.result;

                // Agrega un evento de clic a la imagen para mostrarla en el centro de la pantalla
                image.addEventListener('click', function () {
                    showImageInModal(image.src);
                });

                // Agrega el nombre del usuario y la imagen al contenedor del mensaje
                imageContainer.appendChild(userNameElement);
                imageContainer.appendChild(image);

                // Agrega el contenedor del mensaje al área de mensajes
                messageContainer.appendChild(imageContainer);
                dropArea.appendChild(messageContainer);
            };

            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecciona una imagen.');
        }
    }

    const imageContainers = document.querySelectorAll('.image-container');

    imageContainers.forEach(function (container) {
        container.addEventListener('click', function () {
            const imageSrc = container.querySelector('img').src;
            showImageInModal(imageSrc);
        });
    });

    function showImageInModal(imageSrc) {
        // Crea el modal
        const modal = document.createElement('div');
        modal.classList.add('modal');

        // Crea la imagen dentro del modal
        const modalImage = new Image();
        modalImage.src = imageSrc;

        // Agrega la imagen al modal
        modal.appendChild(modalImage);

        // Agrega el modal al cuerpo del documento
        document.body.appendChild(modal);

        // Activa el modal aplicando la clase "active" después de un breve retraso
        setTimeout(() => {
            modal.classList.add('active');
        }, 50);

        // Cierra el modal al hacer clic fuera de la imagen
        modal.addEventListener('click', function () {
            document.body.removeChild(modal);
        });
    }
