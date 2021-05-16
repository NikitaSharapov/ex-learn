class Form {
    constructor(selector, validator) {
        this.init(selector)
        this.validators = validator;
    }

    submitListeners = []
    validators = {}

    init(selector) {
        this.node = document.querySelector(selector)
        this.node.onsubmit = (event) => {
            event.preventDefault();
            const values = Object.fromEntries(new FormData(this.node).entries())
            this.validate(values)
                .then((values) => (this.broadcast({
                    isValid: true,
                    values
                })))
                .catch((errors) => (this.broadcast({
                    isValid: false,
                    values,
                    errors
                })))
        }
    }

    broadcast(message) {
        this.submitListeners.forEach(listener => (listener(message)))
    }

    onSubmit(callback) {
        if (!(typeof callback === "function")) throw new Error("callback must be a function")
        this.submitListeners.push(callback)
        return this
    }

    validate(values) {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(values);
            const validatorKeys = Object.keys(this.validators);
            const errors = {};

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (validatorKeys.indexOf(key) + 1) {
                    for (let j = 0; j < this.validators[key].length; j++) {
                        const validator = this.validators[key][j];
                        const validate = validator(values, key);
                        if (!validate.success) {
                            errors[key] = validate.message;
                        }
                    }
                }
            }

            if (Object.keys(errors).length === 0) {
                return resolve(values)
            } else {
                return reject(errors);
            }
        })
    }
}

// TODO: form example
// const form = new Form("#form1", {
//     name: [
//         lenGreaterThat.bind(null, 6)
//     ],
//     family: [
//         lenGreaterThat.bind(null, 10)
//     ]
// })
//
// form.onSubmit((form) => {
//     console.log(form);
// })