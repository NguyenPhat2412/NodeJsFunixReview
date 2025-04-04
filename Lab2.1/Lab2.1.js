// Tọa http server cơ bản '
const http = require("http");
const users = []; // tao mang user rong
function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;
  // tao the html de nhap user
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write(
      `<body>
      <form action="/create-user" method="POST">
      <input type="text" name = "username"/>
      <button type = "submit">Send</button>
      </form>
      </body>`
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<body><ul>");
    users.forEach((user) => res.write(`<li>${user}</li>`)); // in ra danh sach user
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }
  // xu ly phan hoi khi nhan du lieu tu form
  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk); // day du lieu vao mang
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // chuyen doi ve chuoi
      const username = parsedBody.split("=")[1]; // tach chuoi theo dau "="
      users.push(username); // them user vao mang
      res.statusCode = 302; // chuyen trang
      res.setHeader("Location", "/users"); // chuyen den trang users
      return res.end(); // ket thuc phan hoi
    });
  }
}

// tạo cổng 3000
const server = http.createServer(requestHandler);
server.listen(3000);
