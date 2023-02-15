export const IdGen = (name) => {
  let year = new Date().getFullYear();
  let id = String(name).split("/");
  if (id[1] == year) {
    return `${parseInt(id[0]) + 1}/${id[1]}`;
  } else {
    return `1/${parseInt(id[1]) + 1}`;
  }
};
