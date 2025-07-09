# DistributionAnimation
## 1. Add a Descriptive Text Question in Qualtrics

Go to your Qualtrics survey editor and:

Add a Descriptive Text question
Click </> to switch to HTML view
Paste this inside:

```<div id="my-animation"></div>```

## 2. Add JavaScript to the question

Add JavaScript and paste the following:

```
Qualtrics.SurveyEngine.addOnReady(function() {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/jinyi-kuang/DistributionAnimation@bc8604a/DistributionAnimation.js";
  script.onload = function () {
    AnimatedDistributionBuilder.init({
      targetId: "my-animation",
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9","10"],
      values: [1,2,3,4,5,6,7,8,9,9,9,9,9,9,9,9,1,5,6,7],
      dropSpeed: 1000,
      autoAdvance: false,
      maxCount: 10,
      yAxisLabel: "Frequency"
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
