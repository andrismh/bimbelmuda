document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');

    postForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page reload

        const title = document.querySelector('input#blogTitle').value;
        const content = document.querySelector('input#blogContent').value;

        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Optionally, clear form or show a success message
            postForm.reset();
            alert('Post submitted successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error submitting post!');
        });
    });
});