const SERVER_URL = 'https://api.flux.codegasms.com';

const convertFileButtons = document.getElementsByClassName('convertFile');

for (var i = 0; i < convertFileButtons.length; i++) {
  const convertFileButton = convertFileButtons[i];

  convertFileButton.addEventListener('click', async (e) => {
    const filePath = document.querySelector(
      `#filePath-${convertFileButton.id}`
    ).value;
    if (filePath === undefined) {
      console.log("User didn't enter a valid name");
    }

    const pathComponents = filePath.split('/');

    const fileName = pathComponents[pathComponents.length - 1];
    let spaceParent = pathComponents.slice(0, -1).join('/');
    if (spaceParent === '') {
      spaceParent = '/';
    }

    console.log(pathComponents);
    console.log(filePath);
    console.log(fileName);
    console.log(spaceParent);

    const fileId = await fetch(`${SERVER_URL}/spaces/get-id`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spaceParent: spaceParent,
        fileName: fileName,
      }),
    })
      .then((res) => res.json())
      .then((data) => data._id);

    const body = JSON.stringify({
      fileId: fileId,
      override: false,
      modParams: {},
    });

    const convertedFile = await fetch(
      `${SERVER_URL}/mods/apply/${convertFileButton.id}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: body,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
        // return data;
      });

    alert(
      `Converted file ${convertedFile.spaceParent}${convertedFile.spaceParent === '/' ? '' : '/'}${convertedFile.fileName} saved in spaces!`
    );

    location.reload();
  });
}
