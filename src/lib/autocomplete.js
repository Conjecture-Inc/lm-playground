var callOpenAI = async (dataJson, modelEndpoint) => {
  var url = modelEndpoint;
  const api_key = "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";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", `Bearer ${api_key}`);

  return new Promise((resolve) => {

    xhr.onload = () => resolve({
      status: xhr.status,
      response: xhr.responseText
    });

    //console.log('data json:', dataJson);

    var data = JSON.stringify(dataJson)

    xhr.send(data);
  }); 
  };


// var callLocalapi calls the local api at localhost:8000/message/
var callLocalapi = async (dataJson) => {
  var url = "http://localhost:8000/complete";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");

  return new Promise((resolve) => {

    xhr.onload = () => resolve({
      status: xhr.status,
      response: xhr.responseText
    });

    console.log('data json:', dataJson);

    var data = JSON.stringify(dataJson)

    xhr.send(data);
  });
};

var generateCompletions = async(prompt, generationSettings) => {
  // if openai in generationSettings['model'], call openai
  if (generationSettings.model.includes('openai')) {
    var dataJson = {
      "prompt": prompt,
      "temperature": generationSettings.temperature || 1.0,
      "max_tokens": generationSettings.max_tokens || 200,
      "top_p": 1,
      "n": generationSettings.n || 1,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "stop": generationSettings.stopSequences || "",
      "model": generationSettings.model || "text-davinci-003"
    }
    const response = await callOpenAI(dataJson, generationSettings.modelEndpoint);
    // convert string to json
    const responseJson = JSON.parse(response.response);
    console.log(responseJson);
    const completionTextList = responseJson.choices.map(c => c.text);
    return completionTextList;
  } else {
    // call local api
    var dataJson = {
      "prompt": prompt,
      "model": generationSettings.model || "gpt-neox-20b",
      "temperature": generationSettings.temperature || 0,
      "max_new_tokens": generationSettings.max_tokens || 200
    }
    const response = await callLocalapi(dataJson);
    // convert string to json
    const responseJson = JSON.parse(response.response);
    // for each response, remove the prompt
    console.log(responseJson);
    const completionTextList = responseJson.response.map(c => c.replace(prompt, ''));
    return completionTextList;
  }
};



export default generateCompletions;