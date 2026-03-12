export const questionsData = [
  {
    id: 1,
    text: "投資を始めるにあたって、一番重視するポイントを教えてください。",
    options: [
      { text: "とにかく普段使っているポイントを貯めたい！", scores: { rakuten: 3, mufg: 2, monex: 2 } },
      { text: "困ったときに電話でプロに相談できる安心感がほしい", scores: { matsui: 5 } },
      { text: "業界No.1の選ばれているサービスで手堅く始めたい", scores: { sbi: 4, rakuten: 2 } },
      { text: "本格的なツールで情報収集して、本気で資産を増やしたい", scores: { moomoo: 5, monex: 2 } }
    ]
  },
  {
    id: 2,
    text: "あなたがよく利用している（または貯めたい）ポイント/経済圏はどれですか？",
    options: [
      { text: "楽天ポイント（楽天市場、楽天カードなど）", scores: { rakuten: 5 } },
      { text: "Vポイント（旧Tポイント含む）、Pontaポイント", scores: { sbi: 3, mufg: 3 } },
      { text: "dポイント（ドコモユーザーなど）", scores: { monex: 4 } },
      { text: "特にこだわっていない / 現金派", scores: { matsui: 2, sbi: 2, moomoo: 1 } }
    ]
  },
  {
    id: 3,
    text: "もし投資でわからないことがあったら、どうやって解決しますか？",
    options: [
      { text: "スマホアプリが使いやすければ、感覚でなんとかする", scores: { rakuten: 4 } },
      { text: "誰かに手取り足取り（電話などで）教えてほしい", scores: { matsui: 5 } },
      { text: "自分でYouTubeやネット、高機能ツールを駆使して調べる", scores: { moomoo: 4, monex: 2 } },
      { text: "ある程度は自分で調べるが、王道の回答が知りたい", scores: { sbi: 4 } }
    ]
  },
  {
    id: 4,
    text: "海外（特にアメリカ）の有名企業（Apple、Amazonなど）への投資に興味はありますか？",
    options: [
      { text: "まずは日本の身近な会社や、投資信託だけで十分", scores: { mufg: 3, matsui: 2 } },
      { text: "もちろん興味あり。本格的に米国株のチャートも分析したい", scores: { moomoo: 5, monex: 3 } },
      { text: "興味はあるけど、手軽にクレカのポイントも貯めつつ運用したい", scores: { monex: 4, sbi: 2 } },
      { text: "投資信託（オルカンなど）を通じて間接的に投資できればOK", scores: { sbi: 3, rakuten: 3 } }
    ]
  },
  {
    id: 5,
    text: "最後に、ご自身の「投資にかけるモチベーション」を選んでください。",
    options: [
      { text: "毎日チャートを見たい！本気で投資家としてステップアップしたい", scores: { moomoo: 5 } },
      { text: "設定だけして、あとは数年間「ほったらかし」にしておきたい", scores: { sbi: 4, rakuten: 2 } },
      { text: "お小遣い稼ぎ感覚で、ポイントを貰いながら楽しく続けたい", scores: { rakuten: 4, mufg: 2 } },
      { text: "まずは少額から、絶対に失敗しないよう慎重に始めたい", scores: { matsui: 4, mufg: 2 } }
    ]
  }
];
