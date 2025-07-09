# DistributionAnimation
## 1. Add a Descriptive Text Question in Qualtrics

Go to your Qualtrics survey editor and:

Add a Descriptive Text question
Click </> to switch to HTML view
Paste this inside:

```<div id="my-animation"></div>```

## 2. Add JavaScript to the question

Click the gear icon ⚙️ → Add JavaScript and paste the following:

```
Qualtrics.SurveyEngine.addOnload(function() {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/jinyi-kuang/DistributionAnimation@main/DistributionAnimation.js";
  script.onload = function () {
    AnimatedDistributionBuilder.init({
      targetId: "my-animation",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
      values: [0, 1, 2, 1, 4, 6, 3, 2, 5],
      dropSpeed: 700,       // You can change this or let the user input it earlier
      autoAdvance: false     // Automatically go to next question after animation
    });
  };
  document.head.appendChild(script);
});
```

## 3.  Save the Drop Sequence

In your Survey Flow, make sure to add an Embedded Data field:

```DropSequence```

Leave the value blank

It will be filled dynamically after the animation finishes.



## This will:

- Load your animation
- Randomly drop the balls one at a time
- Record the drop order in DropSequence
- Auto-advance when finished (optional)
