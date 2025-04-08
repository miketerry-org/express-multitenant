class MyClass {
  #config = {};

  addService(name, createFunc) {
    console.log("before");

    createFunc(this.#config, (value) => {
      console.log("value", value);
    });

    console.log("after");
  }
}

async function say(config, callback) {
  console.log("begin of say");
  let value = "value";
  callback(value);
  console.log("end of say");
}

let my = new MyClass();

my.addService("say", say);
