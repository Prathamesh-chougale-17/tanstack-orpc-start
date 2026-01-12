import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { client } from '@/lib/orpc'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

export const Route = createFileRoute('/api-example')({
  component: ApiExample,
})

type Todo = {
  id: number
  text: string
  completed: boolean
}

function ApiExample() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [divideA, setDivideA] = useState('')
  const [divideB, setDivideB] = useState('')
  const [divideResult, setDivideResult] = useState('')
  const [todos, setTodos] = useState<Array<Todo>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleHello = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await client.hello()
      setGreeting(result.message)
    } catch (err) {
      setError('Failed to call hello: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGreet = async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await client.greet({ name })
      setGreeting(result.message)
    } catch (err) {
      setError('Failed to greet: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDivide = async () => {
    const a = parseFloat(divideA)
    const b = parseFloat(divideB)

    if (isNaN(a) || isNaN(b)) {
      setError('Please enter valid numbers')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await client.divide({ a, b })
      setDivideResult(`Result: ${result.result}`)
    } catch (err) {
      setError('Failed to divide: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await client.getTodos()
      setTodos(result)
    } catch (err) {
      setError('Failed to get todos: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetTime = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await client.getCurrentTime()
      setGreeting(`Current time: ${result.timestamp} (${result.timezone})`)
    } catch (err) {
      setError('Failed to get time: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">oRPC API Examples</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 text-red-900">
          {error}
        </div>
      )}

      {greeting && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-50 p-4 text-green-900">
          {greeting}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simple Hello</CardTitle>
            <CardDescription>
              Call a basic procedure with no inputs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleHello} disabled={loading}>
              Call hello()
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Greet with Name</CardTitle>
            <CardDescription>
              Call a procedure with input validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </Field>
              <Button onClick={handleGreet} disabled={loading}>
                Call greet()
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Division Calculator</CardTitle>
            <CardDescription>
              Example with error handling (try dividing by zero!)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Number A</FieldLabel>
                  <Input
                    type="number"
                    value={divideA}
                    onChange={(e) => setDivideA(e.target.value)}
                    placeholder="10"
                  />
                </Field>
                <Field>
                  <FieldLabel>Number B</FieldLabel>
                  <Input
                    type="number"
                    value={divideB}
                    onChange={(e) => setDivideB(e.target.value)}
                    placeholder="2"
                  />
                </Field>
              </div>
              <Button onClick={handleDivide} disabled={loading}>
                Call divide()
              </Button>
              {divideResult && (
                <p className="text-sm font-medium">{divideResult}</p>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Todos</CardTitle>
            <CardDescription>Async procedure example</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGetTodos}
              disabled={loading}
              className="mb-4"
            >
              Call getTodos()
            </Button>
            {todos.length > 0 && (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      className="rounded"
                    />
                    <span>{todo.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
            <CardDescription>Get server timestamp</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetTime} disabled={loading}>
              Call getCurrentTime()
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
