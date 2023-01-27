import { useEffect, useState } from "react";

const About = () => {
  const [anatolii, setAnatolii] = useState();
  const [ariady, setAriady] = useState();
  const [augusta, setAugusta] = useState();
  const [rafael, setRafael] = useState();

  useEffect(() => {
    getGithubUser("liotcheg").then((info) =>
      setAnatolii({ ...info, name: "Anatolii" })
    );
    getGithubUser("ariady-putra").then((info) =>
      setAriady({ ...info, name: "Ariady" })
    );
    getGithubUser("Augusta-E").then((info) =>
      setAugusta({ ...info, name: "Augusta" })
    );
    getGithubUser("Rafael-C-H").then((info) =>
      setRafael({ ...info, name: "Rafael" })
    );
  }, []);

  const getGithubUser = async (username: string) => {
    const data = await fetch(`https://api.github.com/users/${username}`).then(
      (res) => res.json()
    );
    // console.log(data);
    return data;
  };

  return (
    <div className="flex bg-[image:url('/abt-us.jpg')] bg-no-repeat bg-cover bg-center h-screen w-full items-center">
      <div style={{ margin: "100px", width: "100%" }}>
        <table width="100%">
          <tbody>
            <tr>
              {anatolii &&
                ariady &&
                augusta &&
                rafael &&
                [anatolii, ariady, augusta, rafael].map((user: any) => (
                  <td>
                    <a href={user["html_url"]}>
                      <div style={{ float: "left" }}>
                        <img
                          src={user["avatar_url"]}
                          width="75px"
                          style={{ borderRadius: "25%", padding: "10px" }}
                        />
                      </div>
                      <div style={{ float: "left", fontSize: "50px" }}>
                        <h1>{user["name"]}</h1>
                      </div>
                    </a>
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default About;
