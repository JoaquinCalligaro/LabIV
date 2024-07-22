-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema laboratorio
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema laboratorio
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `laboratorio` DEFAULT CHARACTER SET utf8mb3 ;
USE `laboratorio` ;

-- -----------------------------------------------------
-- Table `laboratorio`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio`.`productos` (
  `idproductos` INT NOT NULL,
  `rubro` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `precio` INT NOT NULL,
  PRIMARY KEY (`idproductos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `laboratorio`.`ventas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio`.`ventas` (
  `idventas` INT NOT NULL,
  `fecha` VARCHAR(10) NOT NULL,
  `cliente` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idventas`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `laboratorio`.`ventas_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `laboratorio`.`ventas_productos` (
  `cantidad` INT NOT NULL,
  `productos_idproductos` INT NOT NULL,
  `ventas_idventas` INT NOT NULL,
  PRIMARY KEY (`productos_idproductos`, `ventas_idventas`),
  INDEX `fk_ventas_productos_ventas1_idx` (`ventas_idventas` ASC) VISIBLE,
  CONSTRAINT `fk_ventas_productos_productos`
    FOREIGN KEY (`productos_idproductos`)
    REFERENCES `laboratorio`.`productos` (`idproductos`),
  CONSTRAINT `fk_ventas_productos_ventas1`
    FOREIGN KEY (`ventas_idventas`)
    REFERENCES `laboratorio`.`ventas` (`idventas`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
