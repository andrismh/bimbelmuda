document.getElementById("postForm").addEventListener("click", async () => {
  // Get input values
  const title = document.getElementById("blogTitle").value;
  const content = document.getElementById("blogContent").value;

  // Send POST request
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();
    console.log("Server response:", data);

    alert("Post submitted successfully!");
  } catch (err) {
    console.error("Error submitting post:", err);
    alert("Failed to submit post.");
  }
});
