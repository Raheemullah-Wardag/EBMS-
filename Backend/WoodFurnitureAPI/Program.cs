using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
//  1. READ CONFIG
// ============================================================
var jwtSettings   = builder.Configuration.GetSection("JwtSettings");
var secretKey     = jwtSettings["Secret"]!;
var issuer        = jwtSettings["Issuer"]!;
var audience      = jwtSettings["Audience"]!;

// ============================================================
//  2. ADD CONTROLLERS
// ============================================================
builder.Services.AddControllers();
// ============================================================
//  3. SWAGGER
// ============================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Change Type to Http and Scheme to bearer
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Just paste your JWT token here. No need to type 'Bearer '!",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, // <-- Changed from ApiKey
        Scheme = "bearer",              // <-- Tells Swagger to auto-add "Bearer "
        BearerFormat = "JWT"
    });

    // v2.x pattern: OpenApiSecuritySchemeReference replaces the removed OpenApiReference
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

// ============================================================
//  4. JWT AUTHENTICATION
// ============================================================
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = issuer,
        ValidAudience            = audience,
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// ============================================================
//  5. AUTHORIZATION POLICIES (RBAC)
// ============================================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",    policy => policy.RequireRole("Admin"));
    options.AddPolicy("ManagerUp",   policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("EmployeeUp",  policy => policy.RequireRole("Admin", "Manager", "Employee"));
    options.AddPolicy("CustomerOnly",policy => policy.RequireRole("Customer"));
});

// ============================================================
//  6. CORS — allow React dev server
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ============================================================
//  7. REGISTER REPOSITORIES (DAL)
// ============================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddScoped<UserRepository>(      _ => new UserRepository(connectionString));
builder.Services.AddScoped<CustomerRepository>(  _ => new CustomerRepository(connectionString));
builder.Services.AddScoped<ProductRepository>(   _ => new ProductRepository(connectionString));
// builder.Services.AddScoped<CategoryRepository>(  _ => new CategoryRepository(connectionString));
builder.Services.AddScoped<OrderRepository>(     _ => new OrderRepository(connectionString));
builder.Services.AddScoped<EmployeeRepository>(  _ => new EmployeeRepository(connectionString));
builder.Services.AddScoped<AttendanceRepository>(_ => new AttendanceRepository(connectionString));
builder.Services.AddScoped<ProductionRepository>(_ => new ProductionRepository(connectionString));
builder.Services.AddScoped<PaymentRepository>(   _ => new PaymentRepository(connectionString));
builder.Services.AddScoped<RawMaterialRepository>(_ => new RawMaterialRepository(connectionString));

// ============================================================
//  8. REGISTER SERVICES (BLL)
// ============================================================
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProductService>();
// builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<ProductionService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<RawMaterialService>();
builder.Services.AddScoped<UserService>();

// ============================================================
//  BUILD
// ============================================================
var app = builder.Build();

// ============================================================
//  9. MIDDLEWARE PIPELINE
// ============================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthentication();   // must be before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();