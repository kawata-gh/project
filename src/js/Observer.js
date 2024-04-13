export const subjects = [];
export class Observer {
  constructor() {}
  receive(s, fnc) {
    if (!(s in subjects)) {
      subjects[s] = [];
      subjects[s].push(this);
      if (!('receiveFncs' in this)) {
        this.receiveFncs = {};
        this.receiveFncs[s] = fnc;
      }
    }
  }
  emit(s) {
    if (s in subjects) {
      for (let i = 0, l = subjects[s].length; i < l; i++) {
        subjects[s][i].receiveFncs[s]();
      }
    }
  }
}
