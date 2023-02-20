interface Person {
  gender?: Gender;
  firstName: string;
  lastName: string;
  birthdate?: Date;

  address?: Address;
}

enum Gender {
  Male,
  Female
}

interface Address {
  city: string;
  country: Country;
  lastAccess?: Date;

  postalCodes?: PostalCode[];
}

interface Country {
  code: string;
  continent?: Continent;
}

interface Continent {
  name?: string;
  countries?: Country[];
}

interface PostalCode {
  code: string;
}

const people = [{
  firstName: "Stefan",
  lastName: "Test",
  birthdate: new Date(1980, 1, 1)
}, {
  firstName: "Max",
  lastName: "Mustermann"
}] as Person[];

function getPerson(index: number) {
  return people[index];
}

class PersonClass {
  getPerson(index: number) {
    return people[index];
  }
}


//Return-Type einer Funktion
type GetPersonReturnType = ReturnType<typeof getPerson>;
type GetPersonClassReturnType = ReturnType<PersonClass["getPerson"]>;

//Properties eines Interfaces
type PersonProperties = keyof Person;
const personPropertyTest: PersonProperties = "firstName";

//Nur String-Properties eines Interfaces
type Property<TObj> = keyof { [TProp in keyof TObj as TObj[TProp] extends string ? TProp : never] };
const personStringPropertyTest: Property<Person> = "firstName";

function personStringPropertyFunc(prop: Property<Person>): { property: string } {
  return {
    property: prop
  };
}

personStringPropertyFunc("firstName");

//Parameter einer Funktion
type GetPersonParameter = Parameters<typeof getPerson>;
type GetPersonFirstParameter = Parameters<typeof getPerson>[0];

//Return-Type mit const (damit ist value fixiert auf JA/NEIN)
function getStatus(ok: boolean) {
  return ok
    ? {
      value: "JA"
    } as const
    : {
      value: "NEIN",
      error: new Error("Etwas läuft schief")
    } as const;
}

type GetStatusReturnType = ReturnType<typeof getStatus>;

//Constraints
function getFirstName<T extends { firstName: string }>(data: T) {
  return data.firstName;
}

//Extrahieren eines generischen Arguments
function getPersonAsync(index: number) {
  return Promise.resolve(getPerson(index));
}

type GetPersonAsyncReturnType = ReturnType<typeof getPersonAsync> extends Promise<infer T> ? T : never;
const x: GetPersonAsyncReturnType = {
  firstName: "Stefan",
  lastName: "Test"
}

//Prüfen ob Wert eine Person ist
function isPerson(val: any): val is Person {
  return !!val.firstName && !!val.lastName;
}

const isPersonTest = {};
if (isPerson(isPersonTest)) {
  const firstName = isPersonTest.firstName;
}

//Prüfen ob Wert eine Person ist, sonst Error
function validatePerson(val: any): asserts val is Person {
  if (!isPerson(val)) {
    throw new Error("Keine Person");
  }
}

const validatePersonTest = {};
validatePerson(validatePersonTest);

const validatePersonTestFirstName = validatePersonTest.firstName;

//Nested Properties
type JoinIndex = [never, 0, 1, 2, 3, 4, 5];

type Join<TKey, TProps> = 
  TKey extends string | number
    ? TProps extends string | number
      ? `${TKey}${"" extends TProps ? "" : "."}${TProps}`
      : never
    : never;

type PropertyNested<TObj, TValueAtEnd = true, TTypes = Date | number | boolean | string, D extends number = 3, TObjRequired = Required<TObj>> =
  //JoinIndex wird rückwärts angewendet. Wenn never erreicht ist, wird nichts mehr gemacht
  D extends never
    ? never
    //Alle Eigenschaften durchgehen. Date, number, boolean string, Arrays und Functions dürfen nur am Ende sein
    : keyof { 
      [TProp in keyof TObjRequired as TObjRequired[TProp] extends Date | number | boolean | string | any[] | Function
        ? TProp extends string
          ? TValueAtEnd extends true
            ? TObjRequired[TProp] extends TTypes
              ? `${TProp}`
              : never
            : never
          : never 
        : TProp extends string
          //Eigenschaften werden mit Hilfe von Join verkettet
          ? TValueAtEnd extends true
            ? Join<TProp, PropertyNested<TObjRequired[TProp], TValueAtEnd, TTypes, JoinIndex[D]>>
            : `${TProp}` | Join<TProp, PropertyNested<TObjRequired[TProp], TValueAtEnd, TTypes, JoinIndex[D]>>
          : never
      ] 
    };

type ArrayNested<TObj, D extends number = 3, TObjRequired = Required<TObj>> = 
  D extends never
    ? never
    : keyof {
      [TProp in keyof TObjRequired as TObjRequired[TProp] extends Date | number | boolean | string | any[] | Function
        ? TProp extends string
          ? TObjRequired[TProp] extends any[]
            ? `${TProp}`
            : never
          : never
        : TProp extends string
          ? Join<TProp, ArrayNested<TObjRequired[TProp], JoinIndex[D]>>
          : never
      ]
    }

const propertyTest1: PropertyNested<Person> = "address.city";
const propertyTest2: PropertyNested<Person> = "address.country.code";
const propertyTest3: PropertyNested<Person> = "address.country.continent.name";
const propertyTest4: PropertyNested<Person, true, Date> = "address.lastAccess";
const propertyTest5: PropertyNested<Person> = "address.country"; //Fehler

//Es dürfen keine Wert-Typen am Ende vorkommen => nur object
const propertyExTest1: PropertyNested<Person, false> = "address.country";
const propertyExTest2: PropertyNested<Person, false> = "address.country.continent";
const propertyExTest3: PropertyNested<Person, false> = "address.country.code"; //Fehler

const arrayTest1: ArrayNested<Person> = "address.postalCodes";
const arrayTest2: ArrayNested<Person> = "address.country.continent.countries";
const arrayTest3: ArrayNested<Person> = "address.country"; //Fehler