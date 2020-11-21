// Scoreboard encapsulates the logic
// for any real-time figures subscription.

export class Scoreboard {
  constructor({
    screen = null,
    keys = {},
    components = {}
  } = {}) {
    this.screen = screen;
    this.keys = keys;
    this.components = components
  }

  loadStyles() {
    let styleObject = document.createElement('link');
    styleObject.rel = 'stylesheet';
    styleObject.type = 'text/css';
    styleObject.href = `./js/screens/${this.screen.familyName()}/style.css`;

    document.head.appendChild(styleObject);
  }

  update() {
    this.updatePanels();
  }

  updatePanels() {
    this.components.panels.forEach(panel => {
      panel.update()
    })
  }

  allKeys() {
    let keys = [];

    Object.keys(this.keys).forEach(key => keys.concat(this.keys[key]));
    
    return keys
  }
}


export class ScoreboardElement extends HTMLElement {
  constructor({
    scoreboard = null,            // @Scoreboard instance.
    parent = null,                // @html Node (defaults to "body").
    templateId = null,            // @string => #id of the template element.
    additionalCssClasses = null,  // @array of strings.
    bindingFunctions = {},        // @key/function pairs. See the "binding" section.
    uponLoad = () => {},          // @function; Named to avoid collission with "onLoad".
    locals = {}                   // @object => additional data for subclasses to use.
  }) {
    super();

    Object.assign(this, {
      scoreboard,
      parent,
      templateId,
      additionalCssClasses,
      bindingFunctions,
      uponLoad,
      locals
    });

    this.initialize()
  }

  initialize() {
    this.keyToAttr = {
      text: 'innerText',
      html: 'innerHTML'
    };

    this.loadTemplates().then((templatesElement) => {
      this.templatesElement = templatesElement;

      if (this.parent && typeof(this.parent.insert) == 'function')
        this.parent.insert(this);
      else {
        let parentElement = this.parent ? this.parent : document.body;
        parentElement.appendChild(this);
      }
    });
  }

  insert(element) {
    this.getYieldElement().appendChild(element)
  }

  getYieldElement() {
    return this.querySelector('[scYield]') || this;
  }

  updateContent(querySelector, attrs, value, allowHtml) {
    allowHtml = allowHtml || false;

    let element = this.querySelector(querySelector)
    if (!element) return;

    if (attrs)
      element.setAttribute(attrs, value);
    else
      element[allowHtml ? 'innerHTML' : 'innerText'] = value;
  }

  getTemplateName() {
    return `${this.templateId}`
  }

  // Limited to a single, hard-coded html file for now.
  loadTemplates() {
    return new Promise((resolve, reject) => {
      let object = document.querySelector('#scoreboard-templates')
      if (object) {
        resolve(object)
      } else {
        fetch(`./js/screens/${this.scoreboard.screen.familyName()}/scoreboard-templates.html`).then(response => {
          response.text().then((contents) => {
            // to prevent race conditions.
            if (document.querySelector('#scoreboard-templates')) {
              resolve(document.querySelector('#scoreboard-templates'));
              return
            }

            let object = document.createElement('div');
            object.id = 'scoreboard-templates';
            object.innerHTML = contents;
            document.body.appendChild(object);
            resolve(object);
          })
        })
      }
    })
  }

  getTemplate() {
    let element = this.templatesElement.querySelector(`template#${this.getTemplateName()}`);
    return element ? element.content.cloneNode(true) : null;
  }

  connectedCallback() {
    this.template = this.getTemplate();
    if (this.template) this.appendChild(this.template);

    this.setAdditionalCss();

    this.initializeBindings();

    this.afterConnectedCallback();
    this.uponLoad()
  }

  afterConnectedCallback() {} // To be defined in subclass.

  setAdditionalCss() {
    if (!this.additionalCssClasses) return;

    this.addCssClasses(this.children[0], this.additionalCssClasses)
  }

  addCssClasses(el, classes) {
    if (!el || !classes) return;
    
    if (typeof(classes) == 'string')
      classes = [classes];

    el.classList.add(...classes)
  }

  removeCssClasses(el, classes) {
    if (!el || !classes) return;
    
    if (typeof(classes) == 'string')
      classes = [classes];

    el.classList.remove(...classes)
  }

  /**
    * Binding Logic
  */

  /**
    * The below code attempts to provide a basic one-way "binding" functionality
    * going from "this.bindingFunctions" object towards the loaded element template.

    * *** Markup ****
    * "scBind" marks any element bound to a dynamic value.
    * "data-{attributeName}='{bindingsFunctionKey}'" traditional structure provide the means to detail the binding.
    * "::bindingsFunctionKey" a-la Angular to mark a one-time update.
    *
    * See "scoreboard-templates.html" file for more info and examples.
    * 
    * **** JS ****
    * For now, binding source is limited to "this.bindinFunctions" object.
    * Each "bindingsFunctionkey => value" pair will act as a function to return the needed value:
    * 
    * this.bindingFunctions[key] = () => { return my_value }
    *
    * Will safely return null/empty if not defined.
  */

  initializeBindings() {
    if (!this.template) return;

    let boundElements = this.querySelectorAll('[scBind]');

    this.bindings = [];
    
    Array.from(boundElements).forEach(e => {
      let dataset = e.dataset;

      Object.keys(dataset).forEach(key => {
        let attribute = key;
        let valueKey = dataset[key];

        this.bindings.push({
          element: e,
          attribute: attribute,
          valueKey: valueKey.replace('::', ''),
          oneTime: valueKey.includes('::'),
          currentValue: null
        })
      })
    })

    this.update()
  }

  update() {
    if (!this.bindings) return;

    this.bindings.forEach(b => {
      if (this.shouldUpdateValue(b))
        this.setBindingValue(b)
    })

    this.onUpdate()
  }

  shouldUpdateValue(binding) {
    return !binding.oneTime || !binding.currentValue
  }

  onUpdate() {}

  setBindingValue(binding) {
    let attr = this.keyToAttr[binding.attribute];
    let bindingFunction = this.bindingFunctions[binding.valueKey];

    if (binding.attribute == 'class') // if it's "class", we simply execute the function.
      this.updateBoundCss(binding, bindingFunction)
    else {
      binding.currentValue = typeof(bindingFunction) == 'function' ? bindingFunction() : null;

      if (attr)
        binding.element[attr] = binding.currentValue;
      else
        binding.element.setAttribute(binding.attribute, binding.currentValue)
    }
  }

  updateBoundCss(binding, bindingFunction) {
    setTimeout(() => {
      if (!binding || !typeof(bindingFunction) == 'function')
        return

      let classes = bindingFunction(); // expected result: { add: [], remove: [] }

      this.addCssClasses(binding.element, classes.add);
      this.removeCssClasses(binding.element, classes.remove)
    }, 50)
  }
} 