import packageInfo from "../../package.json"

const startup = () => `
     _     _  _____   _____   ______   _____  _____  _____  __   _
      \\___/  |       |     | |_____/  |_____]   |   |     | | \\  |
     _/   \\_ |_____  |_____| |    \\_  |       __|__ |_____| |  \\_|
     ${packageInfo.name}
     v${packageInfo.version}
`

export default startup
