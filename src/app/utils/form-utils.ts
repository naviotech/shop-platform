import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  // Expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordPattern = '^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d]{6,}$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === this.emailPattern) {
            return `El correo ingresado no es un correo válido`;
          }
          if (errors['pattern'].requiredPattern === this.namePattern) {
            return `El campo requiere de un nombre y un apellido`;
          }
          if (errors['pattern'].requiredPattern === this.notOnlySpacesPattern) {
            return `El nombre de usuario no permite espacios vacíos`;
          }
          if (errors['pattern'].requiredPattern === this.passwordPattern) {
            return `La contraseña tiene que tener al menos 8 caracteres de los cuales un número, una letra mayúscula, una letra minúscula y un carácter especial.`;
          }
          return 'Campo no válido';

        case 'passwordsNotEqual':
          return 'Las contraseñas no coinciden.';

        case 'noName':
          return 'Este nombre no está disponible'

        default:
          return 'Campo no válido';
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static equalsPassword(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      if (fieldValue1 !== fieldValue2) {
        return {
          passwordsNotEqual: true,
        };
      }
      return null;
    };
  }


  //personalizada

  static noNameEdu(control: AbstractControl): ValidationErrors | null{
    const value = control.value?.toLowerCase()
    return value === 'edu' ? { noName: true}: null
  }
}


