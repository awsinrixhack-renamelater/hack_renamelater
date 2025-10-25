{
  pkgs,
  lib,
  config,
  ...
}:
{
  packages = [
    pkgs.go
    pkgs.python313Packages.flask
    pkgs.nodejs
    pkgs.git
  ];

  languages = {
    go.enable = true;
    python.enable = true;
    javascript.enable = true;
  };

  processes = {
    go-api = {
      cwd = "backend/api";
      exec = "go run .";
    };
    flask-api.exec = "flask --app flask-api/app.py run";
    react-frontend.exec = "npm start --prefix react-frontend";
  };
}

