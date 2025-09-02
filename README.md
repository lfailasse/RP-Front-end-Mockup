## Visão Geral

O RP-Front-end-Mockup é uma aplicação web baseada em React, desenvolvida como o componente de front-end de um projeto em duas partes. Os endpoints, endereçamentos e informações construídas estão configuradas para interagir com o repositório RP-Back-end-Mockup, que gerencia as operações de back-end.

Pode ser que algumas abas ainda estejam em desenvolvimento, atualmente somente os setores de compras, orçamento e financeiro estão em funcionamento.

## Utilização

- Para alterar a URL base de interação com a API, altere a URI dentro do componente "axios.js" como mostrado abaixo:
   ```bash
      const axiosInstance = axios.create({
          baseURL: "http://localhost:8080"
      });
   ```

<br>
   
- Para login, é utilizado um espaço diferente do código para o mesmo. Para tal, em "Login.js", altere:
  ```bash
  try {
     const response = await Axios.post('http://localhost:8080/user/login', { username: Login.username, password: Login.password })
  ...
  ```

<br>

A aplicação possui Dockerfile integrado com as configurações necessárias para deploy em imagem, utilizando multistage

O arquivo "nginx.conf" aplica definições necessárias para o funcionamento preciso do site.

- Com o docker devidamente instalado, utilize:
   ```bash
   docker build -t nome-da-imagem .
