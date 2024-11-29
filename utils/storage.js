export function getUsername() {
    let username = localStorage.getItem("username");
   
    if (!username) {
      username = "ankiiin";
    }
   
    return username;
  }
   