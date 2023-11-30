import "./index.scss";
import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow } from "@wordpress/components";
import { InspectorControls, BlockControls, AlignmentToolbar, useBlockProps } from "@wordpress/block-editor";
import { ChromePicker } from "react-color";

/**
 * This is supposed to lock the Update button if a correct answer is not set.
 * It is not working.
 */
(function() {
  let locked = false
  
  wp.data.subscribe(function() {
    const results = wp.data.select("core/block-editor").getBlocks().filter(function(block) {
      return block.name == "ourplugin/are-you-paying-attention" && block.attributes.correctAnswer == undefined
    })

    if (results.length && locked == false) {
      locked = true
      wp.data.dispatch("core/editor").lockPostSaving("noanswer")
    }

    if (!results.length && locked) {
      locked = false
      wp.data.dispatch("core/editor").unlockPostSaving("noanswer")
    }
  })
})()

wp.blocks.registerBlockType("ourplugin/kwd-react-plugin-one", {
  title: "What Ever Dude",
  icon: "smiley",
  category: "common",
  attributes: {
    question: {type: "string"},
    answers: {type: "array", default: [""]},
    correctAnswer: {type: "number", default: undefined},
    bgColor: {type: "string", default: "#e0e7ef"},
    theAlignment: {type: "string", default: "left"}
  },
  description: "Give your audience a test of their knowledge.",
  example: {
    attributes: {
      question: "What is your favorite animal?",
      correctAnswer: 3,
      answers: ['Cat', 'Dog', 'Skunk', 'Horse'],
      theAlignment: "center",
      bgColor: "#cfe8f1"
    }
  },
  edit: EditComponent,
  save: function (props) {
    return null;
  }
});

function EditComponent (props) {
  const blockProps = useBlockProps({
    className: "question-edit-block",
    style: {backgroundColor: props.attributes.bgColor}
  });

    function updateQuestion(val) {
      props.setAttributes({question: val})
    }

    function deleteAnswer(indexToDelete) {
      const newAnswers = props.attributes.answers.filter(function(x, index) {
        return index != indexToDelete
      })
      props.setAttributes({answers: newAnswers})

      if (indexToDelete == props.attributes.correctAnswer) {
        props.setAttributes({correctAnswer: undefined})
      }
    }

    function markAsCorrect(index) {
      props.setAttributes({correctAnswer: index})
    }

    return (
      <div {...blockProps} >
        <BlockControls>
          <AlignmentToolbar 
            value={props.attributes.theAlignment}
            onChange={x => props.setAttributes({theAlignment: x})}
          />
        </BlockControls>
        <InspectorControls>
          <PanelBody title="Background Color" initialOpen={true}>
            <PanelRow>
              <ChromePicker 
                color={props.attributes.bgColor} 
                onChangeComplete={x => props.setAttributes({bgColor: x.hex})}
                disableAlpha={true} 
              />
            </PanelRow>
          </PanelBody>
        </InspectorControls>
        <TextControl 
          label="Question:" 
          value={props.attributes.question} 
          style={{fontSize: "1.25rem"}}
          onChange={updateQuestion}
        />
        <p style={{fontSize: "0.75rem", margin: "1.25em 0 0.5em 0"}}>Answers:</p>

        {props.attributes.answers.map((answer, i) => {
          return (
            <Flex key={i}>
              <FlexBlock>
                <TextControl 
                  value={answer}
                  autoFocus={answer == undefined}
                  onChange={newVal => {
                    const newAnswers = props.attributes.answers.concat([])
                    newAnswers[i] = newVal
                    props.setAttributes({answers: newAnswers})
                  }}
                />
              </FlexBlock>
              <FlexItem>
                <Button onClick={() => markAsCorrect(i)}>
                  <Icon className="mark-as-correct" icon={props.attributes.correctAnswer == i ? "star-filled" : "star-empty"} />
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="link" className="answer-delete" onClick={() => deleteAnswer(i)}>Delete</Button>
              </FlexItem>
            </Flex>
          )
        })}

        <Button variant="primary" onClick={() => {
          props.setAttributes({answers: props.attributes.answers.concat([undefined])})
        }}>Add another answer</Button>
      </div>
    )
  }