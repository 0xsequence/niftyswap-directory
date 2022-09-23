const fs = require("fs");

// YOU HAVE ONE JOB: If a collection in a chainId has a UID - make sure it's unique
fs.readdirSync("./index").forEach((chainName) => {
  fs.readdirSync(`./index/${chainName}`).forEach((fileName) => {
    if (fileName !== "exchanges.json") return;

    const exchangeFilePath = `./index/${chainName}/exchanges.json`;

    fs.readFile(exchangeFilePath, "utf8", function (err, data) {
      if (err) throw err;

      const exchanges = JSON.parse(data);
      if (!exchanges.length) return;

      // filter out collections
      const filterCollections = exchanges.filter(
        (e) => e.type === "collection"
      );

      // map out collections UIDs
      const collectionUIDs = filterCollections
        .map((c) => c.uid)
        .filter(Boolean);

      const noDublicates = checkIfArrayHadDublicates(collectionUIDs);

      if (!noDublicates) {
        console.log(
          `Collections with same \`uid\` found! Make sure the collections in ${chainName} have unqiue UID!`
        );
        process.exit(1);
      }

      return;
    });
  });
});

function checkIfArrayHadDublicates(myArray) {
  return myArray.length === new Set(myArray).size;
}
