export const cardData = {
  // Shown in handwriting on the inside pages ("Dear ___" line).
  recipientName: "Someone Special",

  // Handwritten sign-off at the end of the letter.
  senderName: "Your Name",

  coverText: "Make a wish",

  coverSubtitle: "Wishing you a day as beautiful as you are",

  pages: [
    {
      number: "01",
      type: "letter",
      greeting: "Dear",
      message: `
      Today is all about you. I wanted to make something
      a little different, something that says what a simple
      message never quite could.

      Thank you for being exactly who you are. The world is
      brighter with you in it, and I hope today reminds you
      of that.
    `,
      signature: "With love,",
    },

    {
      number: "02",
      type: "wishes",
      title: "Wishes For You",
      wishes: [
        "May every dream you hold close come true",
        "May laughter find you wherever you go",
        "May this be your happiest year yet",
      ],
      quote: "Some moments are worth keeping forever.",
    },

    {
      // Photos are private/images/photo1.jpg ... photo4.jpg
      number: "03",
      type: "memories",
      title: "Good Memories",
      message: "A few of my favourite moments with you. Each one still makes me smile.",
      photos: [
        { n: 1, caption: "Good times" },
        { n: 2, caption: "Just us" },
        { n: 3, caption: "Pure joy" },
        { n: 4, caption: "Never forget" },
      ],
      hint: "drag the photos around · tap one to see it bigger",
    },

    {
      number: "04",
      type: "luck",
      title: "Good Luck",
      message: `
      A new year of life is a fresh page, and I can't wait
      to see everything you'll fill it with.

      Whatever challenges come, remember how strong, kind
      and capable you are. You've got this.
    `,
      cheer: "Always cheering for you!",
      signature: "With all my heart,",
    },
  ],
};
