const validateSchema = require('./validateSchema');

// Resolves "live" external references in a schema
// @param {object} schema - JSON Schema object
// @returns {Promise} - Promise that resolves into a resolved schema, that is a
//   schema with all "live" external references resolved and embedded in schema' definitions
function resolveSchema(schema, schemaLoader) {
  // Buffer to capture loaded schemas
  const loadedRefs = {};

  // Wrap provided loader to capture loaded schemas
  function loader(uri) {
    return schemaLoader(uri).then(loadedSchema => {
      const schemaId = loadedSchema['$id'];
      loadedRefs[schemaId] = loadedSchema;
      return Promise.resolve(loadedSchema);
    });
  }

  // Use validateSchema to populate the referenced schemas and then place them under
  // the definition object
  return validateSchema(schema, loader).then(() => {
    // Append definitions if not already available
    let compiledSchema = Object.assign({}, schema);
    if (compiledSchema['definitions'] === undefined) {
      compiledSchema['definitions'] = {};
    }
    // Concatenate all definitions into the result
    compiledSchema.definitions = Object.assign(
      {},
      compiledSchema.definitions,
      loadedRefs,
    );
    return Promise.resolve(compiledSchema);
  });
}

module.exports = resolveSchema;
