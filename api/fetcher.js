export async function ApiFetcher(props) {
    let data = await fetch(`${process.env.API + props.url}`, {
      method: props.method,
      body: JSON.stringify(props.body),
    })
      .then((res) => res.json())
      .catch((err) => err);
    return data;
  }
  