CREATE DATABASE DB_DIRECTORIO_SALUD;
GO

USE DB_DIRECTORIO_SALUD;
GO

-- TABLAS

-- Tabla: Administrador
CREATE TABLE Administrador (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL
);
GO

-- Tabla: Profesional
CREATE TABLE Profesional (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Especialidad NVARCHAR(100) NOT NULL,
    Ubicacion NVARCHAR(150) NOT NULL,
    Fecha_Nacimiento DATE NOT NULL,
    Sexo CHAR(1) CHECK (Sexo IN ('M', 'F')) NOT NULL,
    Telefono NVARCHAR(20) NOT NULL,
    Foto VARBINARY(MAX) NULL
);
GO

-- Tabla: DisponibilidadProfesional
CREATE TABLE DisponibilidadProfesional (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProfesionalId INT NOT NULL,
    Fecha DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    CONSTRAINT FK_Disponibilidad_Profesional FOREIGN KEY (ProfesionalId) REFERENCES Profesional(Id) ON DELETE CASCADE
);
GO

-- Tabla: Paciente
CREATE TABLE Paciente (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    Telefono NVARCHAR(20) NOT NULL,
    Edad INT NOT NULL,
    Contacto NVARCHAR(50) NOT NULL,
    TipoSangre NVARCHAR(5) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaRegistro DATE NOT NULL
);
GO

-- Tabla: Cuenta (elimina la cuenta al eliminar al profesional o paciente)
CREATE TABLE Cuenta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(20) NOT NULL CHECK (Rol IN ('profesional', 'paciente', 'administrador')),
    ProfesionalId INT NULL,
    PacienteId INT NULL,
    AdministradorId INT NULL,
    CONSTRAINT FK_Cuenta_Profesional FOREIGN KEY (ProfesionalId) REFERENCES Profesional(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Cuenta_Paciente FOREIGN KEY (PacienteId) REFERENCES Paciente(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Cuenta_Administrador FOREIGN KEY (AdministradorId) REFERENCES Administrador(Id) ON DELETE SET NULL
);
GO

-- Tabla: ServicioMedico (se elimina automáticamente al eliminar profesional)
CREATE TABLE ServicioMedico (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProfesionalId INT NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    Precio DECIMAL(10,2) NOT NULL,
    FechaDisponible DATETIME2 NOT NULL,
    RequiereChequeo BIT NOT NULL,
    CONSTRAINT FK_Servicio_Profesional FOREIGN KEY (ProfesionalId) REFERENCES Profesional(Id) ON DELETE CASCADE
);
GO

-- Tabla: Cita (se elimina solo si se elimina el servicio o el paciente)
CREATE TABLE Cita (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProfesionalId INT NOT NULL,
    PacienteId INT NOT NULL,
    ServicioId INT NOT NULL,
    Direccion NVARCHAR(250) NOT NULL,
    MetodoPago NVARCHAR(50) NOT NULL,
    Prioridad NVARCHAR(10) NOT NULL CHECK (Prioridad IN ('baja', 'media', 'alta')),
    FechaHora DATETIME2 NOT NULL,
    EstadoCita NVARCHAR(20) NOT NULL CHECK (EstadoCita IN ('agendada', 'confirmada')),
    EsNuevoPaciente BIT NOT NULL,
    CONSTRAINT FK_Cita_Profesional FOREIGN KEY (ProfesionalId) REFERENCES Profesional(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Cita_Paciente FOREIGN KEY (PacienteId) REFERENCES Paciente(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Cita_Servicio FOREIGN KEY (ServicioId) REFERENCES ServicioMedico(Id) ON DELETE CASCADE
);
GO

-- Tabla: Resena (mantener registro pero con IDs nulos si se elimina profesional o paciente)
CREATE TABLE Resena (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Comentario NVARCHAR(1000) NULL,
    Calificacion INT NOT NULL CHECK (Calificacion BETWEEN 1 AND 5),
    Recomienda BIT NOT NULL,
    MotivoVisita NVARCHAR(250) NOT NULL,
    FechaResena DATE NOT NULL,
    ProfesionalId INT NULL,
    PacienteId INT NULL,
    CONSTRAINT FK_Resena_Profesional FOREIGN KEY (ProfesionalId) REFERENCES Profesional(Id) ON DELETE SET NULL,
    CONSTRAINT FK_Resena_Paciente FOREIGN KEY (PacienteId) REFERENCES Paciente(Id) ON DELETE SET NULL
);
GO

-- INSERTAR CUENTA ADMINISTRADOR

INSERT INTO Administrador (Nombre) VALUES ('Roberto Felipe Sanchez');

DECLARE @AdministradorId INT = SCOPE_IDENTITY();

INSERT INTO Cuenta (Email, Password, Rol, ProfesionalId, PacienteId, AdministradorId)
VALUES ('roberto@gmail.com', 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=', 'administrador', NULL, NULL, @AdministradorId);

-- MOSTRAR CUENTAS
SELECT * FROM Cuenta;

/*Clave Administrador: 12345 */
