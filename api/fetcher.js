/*
  url
  method
  body
*/

export async function ApiFetcher(props) {
  try {
    let data = await fetch(`${process.env.API + props.url}`, {
      method: props.method,
      body: JSON.stringify(props.body),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err.Message));
    return data;
  } catch (error) {
    console.log(error);
  }
}
