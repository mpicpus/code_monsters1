// This class provides some common general functions for things...?
export class Asset {
  constructor() {

  }

  getFamily(family, current) {
    family = family || [];
    current = current || this;

    while(current.name !== '') {
      let name = current == this ? current.constructor.name : current.name;
      name = this.underscore(name);

      if (!family.includes(name))
        family.unshift(this.underscore(name));
      
      current = Object.getPrototypeOf(current.constructor)

      this.getFamily(family, current)
    }

    return family
  }

  underscore(name) {
    return name.replace(/([A-Z]+)/g, '_$1').toLowerCase().replace(/^_/, '')
  }
}