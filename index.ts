interface Person {
  firstName: string;
  lastName: string;
  birthdate?: Date;
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
type PersonStringProperties = keyof { [TProp in keyof Person as Person[TProp] extends string ? TProp : never] };
const personStringPropertyTest: PersonStringProperties = "firstName";

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