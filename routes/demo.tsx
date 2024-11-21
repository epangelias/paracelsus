import { define } from '@/lib/utils.ts';
import { Page } from '@/components/Page.tsx';
import { Textarea } from '@/islands/Textarea.tsx';

export default define.page(() => (
    <Page>
        <div>
            <h1>CSS Theme Demo Page</h1>
            <p>
                Welcome to the CSS theme demo page. Below are examples of common HTML elements for
                testing your styles.
            </p>

            <h2>Typography</h2>
            <p>This is a paragraph with normal text.</p>
            <p>
                This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and{' '}
                <a href='#'>a link</a>.
            </p>
            <blockquote>
                "This is a blockquote. It's used to highlight text or quotes."
            </blockquote>
            <pre>
                <code>{`// This is a code block
function hello() {
    console.log("Hello, World!");
}`}</code>
            </pre>

            <p>
                And this is some <code>code.start().then()</code> that I have writ.
            </p>

            <h2>Lists</h2>
            <h3>Unordered List</h3>
            <ul>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
            </ul>

            <h3>Ordered List</h3>
            <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
            </ol>

            <h2>Forms</h2>
            <form>
                <label htmlFor='textInput'>Text Input:</label>
                <input type='text' id='textInput' placeholder='Enter text' />

                <label htmlFor='selectInput'>Select:</label>
                <select id='selectInput'>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                </select>

                <label htmlFor='textareaInput'>Textarea:</label>
                <Textarea id='textareaInput' placeholder='Enter text'></Textarea>

                <label>
                    <input type='checkbox' /> Checkbox
                </label>
                <label>
                    <input type='radio' name='radioGroup' /> Radio Button
                </label>

                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>

            <h2>Tables</h2>
            <table>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1, Cell 1</td>
                        <td>Row 1, Cell 2</td>
                        <td>Row 1, Cell 3</td>
                    </tr>
                    <tr>
                        <td>Row 2, Cell 1</td>
                        <td>Row 2, Cell 2</td>
                        <td>Row 2, Cell 3</td>
                    </tr>
                </tbody>
            </table>

            <h2>Buttons</h2>
            <button>Default Button</button>
            <button className='primary'>Primary Button</button>
            <button className='secondary'>Secondary Button</button>

            <h2>Images</h2>
            <img src='https://via.placeholder.com/150' alt='Placeholder Image' />

            <h2>Miscellaneous</h2>
            <hr />
            <div className='box'>This is a box div for testing containers.</div>
        </div>
    </Page>
));
