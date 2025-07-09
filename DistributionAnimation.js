    (function (window) {
      window.AnimatedDistributionBuilder = {
        init: function ({
          targetId,
          labels,
          values,
          dropSpeed = 1000,
          autoAdvance = false,
          maxCount = 10,
          yAxisLabel = "Frequency",
          xAxisLabel = "Category"
        }) {
          const container = document.getElementById(targetId);
          if (!container) return;

          let dropSequence = [];
          let bucketCounts = Array(labels.length).fill(0);

          // Inject ball styles for modern 3D look
          const style = document.createElement("style");
          style.innerHTML = `
            .ball {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: linear-gradient(145deg, #4facfe, #00f2fe);
              box-shadow:
                inset 0 2px 4px rgba(255, 255, 255, 0.4),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              position: relative;
              overflow: hidden;
            }

            .ball::before {
              content: '';
              position: absolute;
              top: 15%;
              left: 15%;
              width: 40%;
              height: 40%;
              background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
              border-radius: 50%;
            }

            .ball::after {
              content: '';
              position: absolute;
              bottom: 10%;
              right: 10%;
              width: 20%;
              height: 20%;
              background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
              border-radius: 50%;
            }
          `;
          document.head.appendChild(style);

          function setupBuckets(maxCount = 10) {
            container.innerHTML = "";
            bucketCounts = Array(labels.length).fill(0);
            dropSequence = [];

            const ballSize = 30;
            const spacing = 2;
            const unitHeight = ballSize + spacing;
            const chartHeight = unitHeight * (maxCount + 1) + spacing;
            const containerWidth = labels.length * (ballSize + 20) + 40;

            container.style.position = "relative";
            container.style.width = `${containerWidth}px`;
            container.style.height = `${chartHeight}px`;
            container.style.border = "1.5px solid #4A90E2";
            container.style.borderRadius = "10px";
            container.style.background = "#F9FAFB";
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.boxShadow = "0 6px 15px rgba(74, 144, 226, 0.25)";
            container.style.paddingLeft = "40px";

            container.dataset.unitHeight = unitHeight;
            container.dataset.ballSize = ballSize;
            container.dataset.spacing = spacing;

            // Y-axis ticks
            const yAxis = document.createElement("div");
            yAxis.style.position = "absolute";
            yAxis.style.left = "0";
            yAxis.style.top = "0px";
            yAxis.style.bottom = "0px";
            yAxis.style.width = "40px";
            yAxis.style.display = "flex";
            yAxis.style.flexDirection = "column-reverse";
            yAxis.style.justifyContent = "space-between";
            yAxis.style.fontSize = "14px";
            yAxis.style.color = "#333";
            yAxis.style.userSelect = "none";

            for (let i = 0; i <= maxCount + 1; i++) {
              const tick = document.createElement("div");
              tick.textContent = i;
              tick.style.height = `${unitHeight}px`;
              tick.style.lineHeight = `${unitHeight}px`;
              tick.style.textAlign = "right";
              tick.style.paddingRight = "5px";
              yAxis.appendChild(tick);
            }
            container.appendChild(yAxis);

            // Grid lines *between* balls
            const gridLines = document.createElement("div");
            gridLines.style.position = "absolute";
            gridLines.style.left = "40px";
            gridLines.style.top = "0px";
            gridLines.style.bottom = "0px";
            gridLines.style.right = "0";
            gridLines.style.pointerEvents = "none";
            gridLines.style.zIndex = "0";

            for (let i = 0; i < maxCount + 1; i++) {
              const line = document.createElement("div");
              line.style.position = "absolute";
              line.style.left = "0";
              line.style.right = "0";
              line.style.height = "1px";
              line.style.backgroundColor = "#ccc";
              line.style.top = `${i * unitHeight}px`;
              gridLines.appendChild(line);
            }
            container.appendChild(gridLines);

            // Buckets
            labels.forEach((labelText) => {
              const bucket = document.createElement("div");
              bucket.className = "bucket";
              bucket.style.flex = "1";
              bucket.style.height = "100%";
              bucket.style.borderLeft = "1px solid #ccc";
              bucket.style.position = "relative";
              bucket.style.display = "flex";
              bucket.style.flexDirection = "column";
              bucket.style.justifyContent = "flex-end";
              bucket.style.alignItems = "center";
              bucket.style.paddingBottom = `${unitHeight}px`;

              const label = document.createElement("div");
              label.className = "bucket-label";
              label.textContent = labelText;
              label.style.position = "absolute";
              label.style.bottom = "0px";
              label.style.width = "100%";
              label.style.textAlign = "center";
              label.style.fontSize = "14px";
              label.style.backgroundColor = "#E8EFF7";
              label.style.borderTop = "1.5px solid #E8EFF7";
              

              bucket.appendChild(label);
              container.appendChild(bucket);
            });
          }

          function dropBall(bucketIndex, speed) {
            const bucket = container.children[bucketIndex + 1];
            const count = bucketCounts[bucketIndex]++;
            dropSequence.push(bucketIndex);

            const ballSize = parseFloat(container.dataset.ballSize);
            const unitHeight = parseFloat(container.dataset.unitHeight);

            const ball = document.createElement("div");
            ball.className = "ball";
            ball.style.width = `${ballSize}px`;
            ball.style.height = `${ballSize}px`;
            ball.style.borderRadius = "50%";
            ball.style.textAlign = "center"; 
            ball.style.color = "white";
            ball.style.background = "linear-gradient(145deg, #357ABD, #1E5298)";
            ball.style.margin = "0 0 2px 0";
            ball.style.transition = `transform ${speed}ms ease`;
            ball.style.transform = `translateY(-${(count + 1) * unitHeight}px)`;
            ball.textContent = labels[bucketIndex-1];

            bucket.insertBefore(ball, bucket.firstChild);

            requestAnimationFrame(() => {
              ball.style.transform = "translateY(0)";
            });
          }

          async function animateBalls(values, speed) {
            const shuffled = [...values].sort(() => Math.random() - 0.5);
            for (let val of shuffled) {
              dropBall(val, speed);
              await new Promise((r) => setTimeout(r, speed + 200));
            }

            if (typeof Qualtrics !== "undefined" && Qualtrics.SurveyEngine) {
              Qualtrics.SurveyEngine.setEmbeddedData("DropSequence", JSON.stringify(dropSequence));
              if (autoAdvance) document.getElementById("NextButton")?.click();
              else {
                document.getElementById("NextButton")?.style.display = "inline";
            }
          }

          // Parent of the chart container
          const parent = container.parentNode;

          // Create the main vertical wrapper
		const mainWrapper = document.createElement("div");
		mainWrapper.style.display = "flex";
		mainWrapper.style.flexDirection = "column";
		mainWrapper.style.alignItems = "center"; // Center everything horizontally
		
		// Create horizontal wrapper for y-axis label + chart
		const chartWrapper = document.createElement("div");
		chartWrapper.style.display = "flex";
		chartWrapper.style.flexDirection = "row";
		chartWrapper.style.alignItems = "center"; // Center vertically
		
		// Create y-axis label
		const yLabel = document.createElement("div");
		yLabel.textContent = yAxisLabel;
		yLabel.style.writingMode = "vertical-rl";
		yLabel.style.transform = "rotate(180deg)";
		yLabel.style.fontSize = "16px";
		yLabel.style.fontWeight = "600";
		yLabel.style.color = "#333";
		yLabel.style.userSelect = "none";
		yLabel.style.paddingRight = "8px";
		yLabel.style.whiteSpace = "nowrap";
		
		// Create x-axis label
		const xLabel = document.createElement("div");
		xLabel.textContent = xAxisLabel;
		xLabel.style.marginTop = "10px";
		xLabel.style.fontWeight = "600";
		xLabel.style.fontSize = "16px";
		xLabel.style.textAlign = "center";
		
		// Assemble chart wrapper
		chartWrapper.appendChild(yLabel);
		chartWrapper.appendChild(container); 
		
		// Assemble main layout
		mainWrapper.appendChild(chartWrapper);
		mainWrapper.appendChild(xLabel);
		
		// Clear and attach to parent
		if (parent) {
		  parent.innerHTML = "";
		  parent.appendChild(mainWrapper);
		}
		 
		          // Setup buckets and start animation after
		          setupBuckets(maxCount);
		          animateBalls(values, dropSpeed);
		        },
		      };
		    })(window);
