import ValidatedInput from "../../../components/ValidatedInput";
import PhoneInputField from "../../../components/PhoneInputField";
import SelectField from "./SelectField";
import DateOfBirthPicker from "./DateOfBirthPicker";
import "react-phone-input-2/lib/style.css";

const DOCUMENT_TYPES = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte",
  "Tarjeta de Identidad",
];

export type PatientBasicData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  documentType: string;
  cedula: string;
  cellphone: string;
  biologicalSex: string;
};

type PatientBasicsFieldsProps = {
  data: PatientBasicData;
  onChange: (field: keyof PatientBasicData, value: string) => void;
  onDirty: () => void;
};

export default function PatientBasicsFields({
  data,
  onChange,
  onDirty,
}: PatientBasicsFieldsProps) {
  const set = (field: keyof PatientBasicData) => (value: string) => {
    onChange(field, value);
    onDirty();
  };

  return (
    <>
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-2 -mb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            TODOS LOS CAMPOS SON OBLIGATORIOS **
          </p>
        </div>

        <ValidatedInput
          id="first_name"
          label="Nombre(s)"
          placeholder="Nombre(s) del paciente"
          value={data.firstName}
          onChange={set("firstName")}
          required
          maxLength={100}
        />

        <ValidatedInput
          id="last_name"
          label="Apellido(s)"
          placeholder="Apellido(s) del paciente"
          value={data.lastName}
          onChange={set("lastName")}
          required
          maxLength={100}
        />
      </div>

      {/* Fecha de nacimiento y Edad */}
      <div className="mt-4">
        <DateOfBirthPicker
          value={data.dateOfBirth}
          onChange={set("dateOfBirth")}
          onDirty={onDirty}
        />
      </div>

      {/* Tipo de documento y Cédula */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <SelectField
          id="document_type"
          label="Tipo de documento"
          value={data.documentType}
          onChange={set("documentType")}
          required
        >
          <option value="">Seleccione un tipo</option>
          {DOCUMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectField>

        <ValidatedInput
          id="cedula"
          label="Número de documento"
          placeholder="Número de documento"
          value={data.cedula}
          onChange={set("cedula")}
          required
          maxLength={15}
        />
      </div>

      {/* Celular y Sexo biológico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <SelectField
          id="biological_sex"
          label="Sexo biológico"
          value={data.biologicalSex}
          onChange={set("biologicalSex")}
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
          <option value="Otro">Otro</option>
        </SelectField>

        <PhoneInputField
          value={data.cellphone}
          onChange={set("cellphone")}
          onDirty={onDirty}
        />
      </div>
    </>
  );
}
