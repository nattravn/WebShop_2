# WebShop
Work in progress...

<b>Backend:</b>
<ul>
  <li><em>UserApi</em>: REST api with a user database generated via the Identity package from ASP.NET Core.
<br>
Azure key vault integration for safe database connection</li>
  <li><em>WebApi</em>: REST api where the handling for the products is managed. As examples of products (Enteties) I have added Reckord, Clothes, Shoes and Others. To structure the products, each item is tagged with a category ID. Hence there is a category-entety and a sub-category-entity.
<br>
 Production mode: Azure key vault integration for safe database connection 
 Development mode: connection strings without userId and password for, connections to SQL Server Express
</li>
  <br>
  To create a User database for the first time in UserApi run:
  <br>
  Add-migartion "InitialCreate"
  <br>
  Update-Database
  <br>
  <br>
  Code first:
  <br>
  Create Context class (with DBSet<Entity>) and database model
  <br>
  Add-migartion "newDBmigartion"
  <br>
  Update-Database
  <br>
  <br>
  DB-first:
  <br>
  Use EF Core Power Tools reverse engineer to generate database enteties
  <br>
  <br>
  For new controllers:
  Right click add new controller select Context class
  
  To create new admins with admin roles in PostMan run:
  ```
  (post) http://localhost:44329/api/ApplicationUser/Register 
  {
        UserName = "UserName",
        Email = "usename@email.com",
        FullName = "User Name",
        Password = "password"
  }
        and set model.Role = "Admin"; Line 101 in ApplicationUserController.cs
        Admin => RoleId == 1 (managed in AspNetRoles table)
  ```
  Some endpoints has Role-Based Authorization
  
  JSON Web Tokens for log in, generated from AspNetCore.Authentication.JwtBearer. This tooeken needs for perform authorized rest call in UserApi. (Todo implement         JWTokens in WebApi, AddJwtBearer)
  
  Image service to resize images for thumbnails. Products ar storde in database with image paths, for dev images ar storde in wwwroot 
  
  AutoMapper for convert database entities to DTO 
  
  Port: 62921 WebApi
  Port: 44329 UserApi
</ul>

<b>Frontend:</b>


<ul>
  <li><em>WebShopAdmin</em>: Admin where a logged in administrator can add, delete and update products as well as add new categories. 2 modules, modal-wrapper and  category-table (lazy loading)</li>
  <li><em>WebShopSite</em>: The page that presents all products, a user should be able to add products to their shopping cart and place an order</li>
</ul>

Site:
<br/>
<img src="webShop.bmp" width="350">

Admin:

(Log in page)

<img src="admin.bmp" width="350">

(Database content i tables)

<img src="pruduct_table.bmp" width="350">

(modal to edit table item)

<img src="modal.bmp" width="350">

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

