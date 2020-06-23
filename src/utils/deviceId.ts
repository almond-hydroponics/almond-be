const { ObjectId } = require('mongodb');
const { createHash } = require('crypto');

// Returns a predictable ObjectId based on input name
export const getObjectId = name => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex');

  return new ObjectId(hash.substring(0, 8));
};

export const getObjectIds = names => names.map(name => getObjectId(name));

const mapToEntities = names => names.map(name => {
  const id = getObjectId(name);

  return {
    id,
    name,
  };
});
